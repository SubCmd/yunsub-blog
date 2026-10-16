---
title: '출력 스키마 고정 — 파싱이 간헐적으로 깨질 때'
description: '열 번 중 아홉 번 맞는 JSON은 실패한 JSON이다. 프롬프트로 형식을 부탁하는 대신 스키마로 강제한 기록.'
pubDate: 'Oct 16 2026'
tags: ['ai', 'dev']
---

> 시리즈 [프롬프트를 코드처럼 다루기](/blog/2026-10-16-prompt-engineering-01-overview/)의 세 번째 글.

## 터진 문제

리포트 생성 결과를 JSON으로 받아 뒷단에서 가공했다.
로컬 테스트에서는 잘 됐다. 운영에서 깨졌다.

<!--
  실제로 어떻게 깨졌는지 구체적으로 적어야 함. 아래는 흔한 유형임.
  해당하는 것만 남기고, 본인이 겪은 것으로 바꾸세요.
-->

````text
```json
{ "recommendations": [...] }
```
````

이런 식으로 코드펜스가 붙어서 오거나, 앞에 "네, 요청하신 결과입니다"가 붙거나,
배열 마지막에 trailing comma가 들어가거나, 한글 필드명이 섞여 왔다.

핵심은 **빈도**였다. 대부분 성공하니까 로컬에서는 안 보인다.
500명이 쓰는 서비스에서는 그 소수가 매일 발생한다.

## Before — 프롬프트로 형식을 부탁하기

```text
결과를 아래 JSON 형식으로만 출력해줘. 다른 설명은 붙이지 마.

{
  "recommendations": [
    { "major": "학과명", "reason": "근거" }
  ]
}
```

이 방식의 문제는 **보장이 없다는 것**이다.
"다른 설명은 붙이지 마"는 요청이고, 요청은 지켜지지 않을 수 있다.
지켜지지 않았을 때 터지는 건 내 파서다.

## After — 스키마로 강제하고, 그래도 검증하기

### 1단계: 모델이 형식을 벗어날 수 없게 한다

Tool use(function calling)나 structured output을 쓰면 형식이 프롬프트가 아니라 **API 레벨 제약**이 된다.

```python
TOOL = {
    "name": "submit_recommendations",
    "description": "학과 추천 결과를 제출한다.",
    "input_schema": {
        "type": "object",
        "properties": {
            "recommendations": {
                "type": "array",
                "minItems": 3,
                "maxItems": 3,
                "items": {
                    "type": "object",
                    "properties": {
                        "major": {"type": "string"},
                        "reason": {"type": "string"},
                        "evidence": {
                            "type": "string",
                            "description": "생활기록부 원문 인용. 요약하지 않는다.",
                        },
                    },
                    "required": ["major", "reason", "evidence"],
                },
            }
        },
        "required": ["recommendations"],
    },
}
```

여기서 중요한 건 `minItems`/`maxItems`다.
"3개만 추천해줘"라는 프롬프트 지시가 **스키마 제약으로 옮겨갔다.**
프롬프트에서 지킬 규칙이 하나 줄었다.

`description`도 프롬프트의 일부다. `evidence` 필드에 "요약하지 않는다"를 붙이는 게
본문 프롬프트에 같은 말을 쓰는 것보다 잘 작동했다.
**규칙은 그 규칙이 적용되는 필드 옆에 둘 때 가장 잘 지켜진다.**

### 2단계: 그래도 검증한다

<!--
  실제로 쓰고 있는 검증 로직으로 바꾸세요. Pydantic을 쓰면 그걸 쓰고,
  수동 검증이면 수동 검증이라고 쓰면 됩니다.
-->

```python
class Recommendation(BaseModel):
    major: str
    reason: str
    evidence: str

class Report(BaseModel):
    recommendations: list[Recommendation] = Field(min_length=3, max_length=3)
```

스키마를 걸어도 검증은 남겨둔다. 이유는 두 가지다.

- 모델 버전이 올라가면 동작이 미묘하게 바뀐다. 검증은 그걸 **조용한 실패가 아니라 에러로** 만든다.
- 스키마는 타입을 보장하지만 **내용**은 보장하지 않는다. `evidence`가 빈 문자열이어도 스키마는 통과한다.

### 3단계: 내용 검증은 따로 한다

가장 중요한 검증은 스키마가 못 잡는 쪽이었다.

```python
def validate_evidence(report: Report, source_text: str) -> list[str]:
    """인용했다는 문구가 실제로 원문에 있는지 확인한다."""
    return [
        r.major for r in report.recommendations
        if r.evidence not in source_text
    ]
```

<!--
  이 검증을 실제로 돌려봤다면, 몇 %에서 인용이 원문에 없었는지 적으세요.
  환각 탐지를 "직접 측정했다"는 건 이력에서 강한 신호입니다.
-->

(이 검증에서 걸러진 비율과, 그걸 보고 프롬프트를 어떻게 고쳤는지 적는다.)

## 무엇이 좋아졌는가

<!--
  1. 파싱 실패율: 도입 전 몇 %, 도입 후 몇 %
  2. 몇 건의 요청을 기준으로 측정했는가
  3. 재시도 로직을 걷어낼 수 있었는가 (그렇다면 그게 성과입니다)
-->

(파싱 실패율 변화와 측정 방법을 적는다.)

## 이 기법이 안 통하는 경우

- **출력이 긴 산문일 때.** 스키마는 구조화된 출력에 맞다. 리포트 본문 같은 자유 서술을 억지로 필드에 쪼개면 글이 부자연스러워진다. 이때는 산문은 산문으로 받고, 메타데이터만 스키마로 분리하는 편이 나았다.
- **스키마가 깊게 중첩될 때.** 3단 이상 중첩되면 모델의 필드 누락이 늘었다. 중첩을 줄이거나 호출을 나누는 게 빨랐다.
- **탐색적인 작업.** 어떤 출력이 필요한지 아직 모르는 단계에서 스키마를 먼저 박으면, 모델이 줄 수 있었던 더 나은 형태를 못 보게 된다.

## 정리

"JSON으로만 답해줘"는 프롬프트 엔지니어링이 아니라 희망이다.
형식은 프롬프트에서 빼서 **스키마와 검증으로 내리는 것**이 맞았다.
그러면 프롬프트에는 형식이 아니라 판단 기준만 남는다.

다음 글: [Few-shot 예시 설계](/blog/2026-10-16-prompt-engineering-04-few-shot/) — 그 판단 기준을 예시로 가르치는 방법.
