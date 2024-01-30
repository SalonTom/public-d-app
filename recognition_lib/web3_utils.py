import json
from web3 import Web3  # Ajoutez cette ligne pour importer Web3

contract = None

net_url = "http://localhost:8545"  # Remplacez cela par l'URL de votre nœud Web3
web3 = Web3(Web3.HTTPProvider(net_url))

def connect():
    global contract
    # Récupération du fichier abi
    with open('ProjectTokenFactory.json', 'r') as contract_file:
        contract_data = json.load(contract_file)
        abi = contract_data.get("abi")

    with open('Address.json', 'r') as address_file:
        address_data = json.load(address_file)
        address = address_data.get("Voting")

    print("Adresse : " , address)
    print("ABI : " , abi)
    contract = web3.eth.contract(address=address, abi=abi)


def update_whitelist(eth_address, status):
    global contract

    if contract is not None:
        private_key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
        caller = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
        nonce = web3.eth.get_transaction_count(caller)

        chain_id = web3.eth.chain_id

        # Call your function
        call_function = contract.functions.whitelistUser(eth_address, status).call()

        #print(contract.functions.whitelist(eth_address).call())


