import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def write_to_file(content, destination_path):
    """
    Writes the given content to the specified file.

    :param content: The content to write to the file
    :param destination_path: The path to the destination file, relative to the root directory
    """
    full_path = os.path.join(ROOT_DIR, destination_path)

    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    with open(full_path, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f"Content written to {full_path}")

def read_file_if_exists(file_path):
    """
    Reads the content of the specified file if it exists.

    :param file_path: The path to the file to read, relative to the root directory
    :return: The content of the file if it exists, otherwise None
    """
    full_path = os.path.join(ROOT_DIR, file_path)

    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as file:
            content = file.read()
        print(f"Content read from {full_path}")
        return content
    else:
        print(f"File {full_path} does not exist")
        return None