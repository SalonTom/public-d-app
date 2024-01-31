import image_utils, text_utils, web3_utils
from datetime import datetime, timedelta


def is_adult(date_string):
    try:
        date_format = "%d.%m.%Y" if '.' in date_string else "%d %m %Y"
        birth_date = datetime.strptime(date_string, date_format)

        current_date = datetime.now()
        print(birth_date)

        age = current_date.year - birth_date.year - (
                (current_date.month, current_date.day) < (birth_date.month, birth_date.day))

        return age >= 18

    except ValueError:
        return False


async def search_pii(file_path, eth_address):
    rules = text_utils.get_regexes()

    original, intelligible = image_utils.scan_image_for_text(file_path)
    text = original

    map_occurences = text_utils.count_word_occurrences(text)
    max_id = (0, '')
    date_of_birth = text_utils.date_of_birth_pii(text, rules)
    if date_of_birth:
        card_numbers = text_utils.card_number_pii(text, rules)
        for number in card_numbers:
            if map_occurences.get(number.lower()) is not None and map_occurences.get(number.lower()) > max_id[0]:
                max_id = (map_occurences.get(number.lower()), number.lower())
    old_date_of_birth = text_utils.old_date_of_birth_pii(text, rules)
    if old_date_of_birth:
        old_card_numbers = text_utils.old_card_number_pii(text, rules)
        for number in old_card_numbers:
            if map_occurences.get(number.lower()) is not None and map_occurences.get(number.lower()) > max_id[0]:
                max_id = (map_occurences.get(number.lower()), number.lower())

    is_adult_bool = False
    id = ""
    if date_of_birth:
        is_adult_bool = is_adult(date_of_birth[0])
        id = max_id[1]
    elif old_date_of_birth:
        is_adult_bool = is_adult(old_date_of_birth[0])
        id = max_id[1]

    result = {
        "is_adult": is_adult_bool,
        "id": id
    }
    if not is_adult_bool:
        web3_utils.update_whitelist(eth_address, 0)
    else:
        web3_utils.update_whitelist(eth_address, 2)

    return result
