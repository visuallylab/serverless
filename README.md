<h1 align="center">
  Serverless
</h1>
<p align="center">
  <img src="https://badgen.net/badge/packages/severless/purple?list=1" />
  <img src="https://badgen.net/badge/⬢ node/>=8/green" />
</p>

## Setup

必須加入 **Serverless-admin** Role 至你的 AWS Credentials （accessID, secretKey 請找啟軒拿）

`~/.aws/credentials`
```
...
[serverless]
aws_access_key_id=***************
aws_secret_access_key=***************
...
```

[reference](https://serverless.com/framework/docs/providers/aws/guide/credentials/)


## Development

*`所有指令都要在各 service 資料夾下才能操作`*

依照功能區分每個資料夾，service 獨立運作，擁有屬於自己的 node_modules 與 deploy 機制。

- service: like a project
- Function: => lambda function
- Events: trigger function to run
- Resources: define the infrastructure resources you need  in your Service depend on

### deploy service
```sh
serverless deploy -v --aws-profile serverless
```

### deploy function
```sh
serverless deploy function --function FUNCTION_NAME --aws-profile serverless
```

### More Info
- [doc](https://serverless.com/framework/docs/providers/aws/guide/services/)
- [example](https://github.com/serverless/examples)
