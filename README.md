## kafka-consumer-in-nestjs

NestJS로 kafka consumer를 만듭니다. 어댑터 레벨에서 메시지를 처리하기 때문에, 컨트롤러로 메시지가 들어옵니다.

이에 따라 자연스럽게 예외 필터(Exception filters), 미들웨어, 가드, 인터셉터, 파이프 등 NestJS의 코어 기능들을 비롯하여 NestJS의 DI를 그대로 활용할 수 있습니다.

### Inspiration

본 레포지토리는 NestJS Korea의 NestJS 밋업, ["야너두 NestJS!"](https://nestjs-korea.notion.site/3rd-NestJS-wrap-up-1bd4e5cf44f94797a0645316ac431f3b)의 세 번째 발표인 [`Lets NestJS Anything`](https://youtu.be/IsX1vgWYVpE?t=4183)에서 영감을 받았습니다.

발표에서는 슬랙 봇을 NestJS의 어댑터로써 사용하는 모습을 보여주는 장면이 있었습니다. 이 부분을 보면서, 디스코드 봇도 만들어 볼 수 있지 않을까? 하는 생각이 들어 디스코드 봇을 만들어보았고, 성공했습니다. ([관련 코드](https://github.com/Coalery/discord-bot-with-nestjs))

하지만 HTTP 어댑터다보니 핸들러를 등록하는 과정에서 받아올 수 있는 파라미터가 `path`와 요청을 처리할 `handler` 밖에 없었습니다. 이때 `handler`는 host filter, guard, interceptor 등 많은 과정을 래핑하여 적용한 메서드입니다. 그래서 어댑터 내에서는 컨트롤러의 원본 핸들러에 접근할 수 없었고, 이에 따라 메타데이터를 갖고 올 수 없다는 한계점이 있었습니다.

이 한계점을 아래에서 서술할 아이디어를 기반으로, kafka consumer를 구현한 레포지토리입니다.

### Idea

> `AppModule`을 받아서 직접 순회하면 되지 않을까?

`AppModule`의 메타데이터에는 `imports`로 해당 NestJS 앱 안에서 사용하는 내부 모듈이 아닌 모든 모듈에 대해 접근할 수 있다는 특징이 있습니다.

예를 들면 다음과 같습니다.

```typescript
@Module({
  imports: [AModule, BModule]
  controllers: [/* ... */]
  providers: [/* ... */]
})
export class AppModule {}
```

위와 같이 모듈을 만들면, `AppModule`의 `imports` 메타데이터에 `[AModule, BModule]`이 들어가는 형태입니다.

즉 Forward reference나 Dynamic Module이 없다는 가정 하에, 모듈은 트리 구조를 갖는 다는 걸 알 수 있습니다.

따라서 DFS로 순회를 돌면서 컨트롤러들을 확인하여 해당하는 핸들러의 메타데이터를 맵에 저장하고, 그 뒤에 사용하는 형태로 구현하였습니다.

### Prerequirements

- Node v18.18.0
- docker compose v2

### Installation

```shell
git clone https://github.com/Coalery/kafka-consumer-in-nestjs.git
cd kafka-consumer-in-nestjs
npm install
npm run build
```

### Run

```shell
docker compose up

# 카프카가 완전히 실행된 후에
npm run start:prod
```

### License

[MIT licensed](LICENSE)
