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
    

def comment_java_file(file_path, line_number_to_comment):
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()

        if 1 <= line_number_to_comment <= len(lines):
            if not lines[line_number_to_comment - 1].strip().startswith("//"):
                lines[line_number_to_comment - 1] = "// " + lines[line_number_to_comment - 1]
        
        with open(file_path, 'w') as file:
            file.writelines(lines)
        
        print(f"Line {line_number_to_comment} has been commented.")
    
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
