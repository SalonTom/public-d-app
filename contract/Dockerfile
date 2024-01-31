FROM node:lts-alpine

WORKDIR /contract

COPY package.json .

RUN npm install
COPY . .

RUN npx hardhat compile

EXPOSE 8545

CMD npx hardhat node; npx hardhat run scripts/deploy-contract.ts --network localhost