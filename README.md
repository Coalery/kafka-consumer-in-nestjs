## kafka-consumer-in-nestjs

NestJS로 kafka consumer를 만듭니다. 어댑터 레벨에서 메시지를 처리하기 때문에, 컨트롤러로 메시지가 들어옵니다.

이에 따라 자연스럽게 예외 필터(Exception filters), 미들웨어, 가드, 인터셉터, 파이프 등 NestJS의 코어 기능들을 비롯하여 NestJS의 DI를 그대로 활용할 수 있습니다.

### Inspiration

본 레포지토리는 NestJS Korea의 NestJS 밋업, ["야너두 NestJS!"](https://nestjs-korea.notion.site/3rd-NestJS-wrap-up-1bd4e5cf44f94797a0645316ac431f3b)의 세 번째 발표인 [`Lets NestJS Anything`](https://youtu.be/IsX1vgWYVpE?t=4183)에서 영감을 받았습니다.

발표에서는 슬랙 봇을 NestJS의 어댑터로써 사용하는 모습을 보여주는 장면이 있었습니다. 이 부분을 보면서, 디스코드 봇도 만들어 볼 수 있지 않을까? 하는 생각이 들어 디스코드 봇을 만들어보았고, 성공했습니다. ([관련 코드](https://github.com/Coalery/discord-bot-with-nestjs))

하지만 HTTP 어댑터다보니 핸들러를 등록하는 과정에서 받아올 수 있는 파라미터가 `path`와 요청을 처리할 `handler` 밖에 없었습니다. 이때 `handler`는 host filter, guard, interceptor 등 많은 과정을 래핑하여 적용한 메서드입니다. 그래서 어댑터 내에서는 컨트롤러의 원본 핸들러에 접근할 수 없었고, 이에 따라 메타데이터를 갖고 올 수 없다는 한계점이 있었습니다.

이 한계점을 "`AppModule`을 받아서 직접 순회하면 되지 않을까?"라는 아이디어를 기반으로, kafka consumer를 구현한 레포지토리입니다.

### Idea

의존성 처리 전에 어댑터가 생성되어야 하는데, 결국 모든 처리가 어댑터에서 이루어지기 때문에 nestjs의 DI Container를 사용할 수 없습니다.

또한 `DiscordBotAdapter#get` 메서드에서 받는 `handler` 파라미터가 컨트롤러의 메서드를 가리키는 것이 아니라, 컨트롤러의 메서드를 host filter, guard, interceptor 등 많은 과정을 적용한 메서드입니다. 따라서 컨트롤러의 메서드에 붙어 있는 메타데이터를 가져올 수 없다는 한계점이 존재합니다.

다만, 실제로 명령어 처리를 시작하는 것은 `INestApplication#listen` 메서드를 호출한 뒤라는 사실을 활용하면 조금 tricky 하더라도 메타데이터 정보를 어댑터 안으로 가져올 수 있습니다.

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
