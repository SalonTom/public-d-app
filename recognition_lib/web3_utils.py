import json

from eth_account import Account
from web3 import Web3  # Ajoutez cette ligne pour importer Web3

contract = None

net_url = "http://localhost:8545"  # Remplacez cela par l'URL de votre nœud Web3
w3 = Web3(Web3.HTTPProvider(net_url))

def connect():
    global contract
    global api_address
    global private_key

    # Récupération du fichier abi
    with open('../shared_contracts_info/ProjectTokenFactory.json', 'r') as contract_file:
        contract_data = json.load(contract_file)
        abi = contract_data.get("abi")

    with open('../shared_contracts_info/Address.json', 'r') as address_file:
        address_data = json.load(address_file)
        address = address_data.get("Address")

    with open('../shared_contracts_info/API.json', 'r') as api_file:
        api_data = json.load(api_file)
        api_address = api_data.get("api_address")
        private_key = api_data.get("private_key")
    contract = w3.eth.contract(address=address, abi=abi)

def update_whitelist(eth_address, status) :
    Chain_id = w3.eth.chain_id
    global private_key
    global api_address

    nonce = w3.eth.get_transaction_count(api_address)

    call_function = contract.functions.whitelistUser(eth_address, status).build_transaction(
        {"chainId": Chain_id, "from": api_address, "nonce": nonce})

    signed_tx = w3.eth.account.sign_transaction(call_function, private_key=private_key)

    send_tx = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    tx_receipt = w3.eth.wait_for_transaction_receipt(send_tx)

