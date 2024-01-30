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
        address = address_data.get("Address")

    contract = web3.eth.contract(address=address, abi=abi)


def update_whitelist(eth_address, status):
    global contract
    if contract is not None:
        call_function = contract.functions.whitelistUser(eth_address, status).transact()
