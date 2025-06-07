import re
from typing import List, Dict
from models import Tool, Project
from helpers import file_paths as fp
from helpers import file_helper 
from helpers import defects4j_helper as d4jh
from helpers import tree_sitter_java as tsj


def create_class_with_assigned_test_method(java_code: str, test_method_info, all_methods: list, all_imports):
    """Creates a new test class with only one test method while keeping other members untouched."""
    _, test_method_node = test_method_info
    
    # Extract code for test method
    method_code = java_code[test_method_node.start_byte : test_method_node.end_byte]
    
    # Extract class declaration before body    
    # Preserve all non-test methods and members
    preserved_methods = [java_code[m.start_byte : m.end_byte] for m in all_methods]

    extends_clause = "" if "import org.junit.Test;" in all_imports else " extends TestCase"


    new_class_code = f"""
{all_imports}

public class StudentTest{extends_clause} {{
""" + "\n".join(preserved_methods) + "\n   " + method_code + "\n}"
    
    return new_class_code

def generate_kill_matrix(project: Project, tool: Tool) -> Dict[str, List[str]]:
    """Generates the kill matrix for the given project and tool.

    - Extracts all the test methods from the student's test file.
    - Creates a placeholder test class with one extracted test method at a time.
    - Runs the mutation analysis for each class created.
    - Iterares over each test and returns the kill matrix.

    Args:
        project (Project): The project to analyze.
        tool (Tool): The tool to use for the analysis.

    Returns:
        Dict[str, List[str]]: A dictionary where the keys are the test method names and the values are the list of mutants killed by that test. It also returns a list of all killed mutants.
    """
    with open(fp.student_test_file_path, 'r') as file:
        java_code = file.read()

    kill_matrix: Dict[str, List[str]] = {}
    all_killed_mutants = set()  

    all_imports = re.findall(r'import .*;', java_code)
    all_imports = '\n'.join(all_imports)

    package = re.search(r'package\s+([\w\.]+);', java_code)
    if package:
        all_imports = f"package {package.group(1)};\n" + all_imports

    test_method_bodies, all_methods, _ = tsj.extract_test_methods(java_code) 

    for test_method in test_method_bodies:
        new_class_code = create_class_with_assigned_test_method(java_code, test_method, all_methods, all_imports)
        file_helper.write_to_file(new_class_code, fp.placeholder_test_file_path)

        test_method_name, _ = test_method
        project.clear_project_tools_output()
        
        try:
            d4jh.run_kill_matrix_analysis(project.name_version, tool.name)
            mutants_killed_by_this_test: List[str] = tool.get_mutants_killed_by_test(project.name_version)
            kill_matrix[test_method_name] = mutants_killed_by_this_test
            all_killed_mutants.update(mutants_killed_by_this_test) 

        except Exception as e:
            print(f"Error in running kill matrix analysis: {e}")
            print(f"Skipping test method {test_method_name}")
            print(new_class_code)
            kill_matrix[test_method_name] = ["error"]

    return kill_matrix, list(all_killed_mutants)


