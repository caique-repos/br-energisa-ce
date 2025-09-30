FROM node:lts-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    libxml2 \
    libpam0g \
    libaio1 \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
