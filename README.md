# awesome-tool

> A GitHub App built with [Probot](https://github.com/probot/probot) that automates the process of synchronizing and managing GitHub PRs with Monday.com tasks

## Setup

```sh
# Install dependencies
npm install

# Compile
npm run build

# Run
npm run start
```

## Docker

```sh
# 1. Build container
docker build -t awesome-tool .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> awesome-tool
```

## Contributing

If you have suggestions for how awesome-tool could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2020 Arnold Duan <Chengzhu.Duan@gmail.com>
