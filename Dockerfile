FROM jtbaird/alpine-node-mongo AS build

COPY . .
RUN npm ci  
# RUN npm audit --production --audit-level=moderate
# RUN npm run test 

RUN npm run build && NODE_ENV=production npm prune


FROM node:lts-alpine
COPY --from=build build/src .
COPY --from=build node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "main/server.js" ]
