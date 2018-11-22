FROM mhart/alpine-node:10 as builder
WORKDIR /app
RUN yarn global add serve
COPY . .
 # Bundle app source
FROM mhart/alpine-node:base-10
WORKDIR /app
COPY --from=builder /app .
COPY --from=builder /usr/local/share/.config/yarn/global /usr/local/share/.config/yarn/global
EXPOSE 5000
CMD /usr/local/share/.config/yarn/global/node_modules/serve/bin/serve.js 
