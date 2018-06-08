serpentary 2018
===============

This is the 2018 version of the serpentary football pool software.

I'm basically writing a new one every year to try out new technologies.

This year it uses AWS Lambdas written in Go as its backend,
Protocol Buffers as the data exchange format,
and a React/Redux app written in TypeScript as a user interface.

It also makes use of several other AWS services.
The base project was created using AWS CodeStar,
the file layout is loosely based on the Go web application template,
but with many changes and additions.
The app uses Cognito for user management,
API Gateway for routing requests to the backend Lambdas,
S3 to host the web app and CloudFront to distribute it,
and CodePipeline, CodeBuild and CloudFormation to build and deploy it.
The web app is compiled and packaged using webpack.
