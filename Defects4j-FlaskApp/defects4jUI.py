from flask import Flask, render_template, request, Response, session, jsonify, url_for
import os
import subprocess
import json
import glob
import re
import pandas as pd
import projectmanager as pm
import jsoneditor as je
import ast
#from bs4 import BeautifulSoup

app = Flask(__name__)
app.secret_key = "e60OMnoWrQaHjlz"
app.config["SESSION_COOKIE_NAME"] = "4yRw187RKmd31B4"

def clear_files():
    
    path = '/root/' + session["project"] + 'f/tools_output/' + session["tool"] + '/*'
    files = glob.glob(path)

    for f in files:
        os.remove(f)

def load_editor():

    content = je.load_json_save(session["project_name"], session["project_version"])
    destination_path = "static/projectdata/StudentTest.java"

    # Open the destination file in write mode
    with open(destination_path, 'w') as destination_file:
        # Write the content to the destination file
        destination_file.write(content)

def major_parse(df):
    mutant_list = df["Mutant"].tolist()

    line_list = list()
    operator_list = list()
    original_list = list()
    mutated_list = list()

    for _, row in df.iloc[1:].iterrows():
        details = ast.literal_eval(row['Details'])
        line_list.append(details.get('line'))
        operator_list.append(details.get('operator'))
        original_list.append(details.get('original'))
        mutated_list.append(details.get('mutated'))

    sheet_data = list()

    for item1, item2, item3, item4, item5 in zip(mutant_list, line_list, operator_list, original_list,
                                                    mutated_list):
        sheet_data.append((item1, item2, item3, item4, item5))

    return sheet_data

def pit_parse(df):
    mutant_list = df["Mutant"].tolist()

    line_list = list()
    operator_list = list()
    method_list = list()

    for _, row in df.iloc[1:].iterrows():
        details = ast.literal_eval(row['Details'])
        line_list.append(details.get('line'))
        mutator = details.get('mutator')
        if mutator:
            trimmed_mutator = mutator.replace('org.pitest.mutationtest.engine.gregor.mutators.', '')
        operator_list.append(trimmed_mutator)
        method_list.append(details.get('mutated_method'))

    sheet_data = list()

    for item1, item2, item3, item4 in zip(mutant_list, line_list, operator_list, method_list):
        sheet_data.append((item1, item2, item3, item4))

    return sheet_data

def csv_compare(df1, df2):

    ids_df1 = set(df1['Mutant'])
    ids_df2 = set(df2['Mutant'])

    mutant_list = list(ids_df1 - ids_df2)

    return mutant_list


def store_csv():

    path = "/root/results.csv"

    df = pd.read_csv(path)

    if not os.path.exists("/root/" + session["project"] + "-" + session["tool"] + ".csv"):
        df.to_csv("/root/" + session["project"] + "-" + session["tool"] + ".csv", index=False)

def load_csv(project):
    
    path = "/root/" + project + ".csv"

    df = pd.read_csv(path, header=None, names=["Mutant", "Details"])

    return df

def get_class_path(project):

    path = "/root/" + project + "f"

    if not os.path.isdir(path):
        raise ValueError(f"The directory {path} does not exist.")
    
    cmd = "defects4j export -p dir.src.classes"

    result = subprocess.run(cmd, shell=True, cwd=path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    src = result.stdout

    cmd = "defects4j export -p classes.modified"

    result = subprocess.run(cmd, shell=True, cwd=path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    bin = result.stdout

    bin = bin.replace('.', '/')

    return path + "/" + src + "/" + bin + ".java"

def get_devsuite_path(project):

    path = "/root/" + project + "f"

    if not os.path.isdir(path):
        raise ValueError(f"The directory {path} does not exist.")
    
    cmd = "defects4j export -p dir.src.tests"

    result = subprocess.run(cmd, shell=True, cwd=path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    src = result.stdout

    aux = project.split("-")
    id = aux[0]
    version = aux[1]

    cmd = "defects4j query -p " + id + " -q classes.relevant.test -o test.csv"
    result = subprocess.run(cmd, shell=True, cwd=path, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    df = pd.read_csv("/root/" + project + "f/test.csv")
    value = df.isin([int(version)])
    row, col = value.idxmax()
    bin = str(df.iat[row,1])

    bin = bin.replace('.', '/')

    return path + "/" + src + "/" + bin + ".java"

def file_data(path):
    data = str()
    with open(path, encoding='utf-8') as f:
        data = f.read()

    return data

def coverage():
    cmd = ("defects4j coverage -w $HOME/" + session["project"] + "f")
    output = subprocess.check_output(cmd, shell=True, text=True)

    pattern = r'\d+(?:\.\d+)?'

    matches = re.findall(pattern, output)

    return matches

def summary():
    path = os.path.split(os.getcwd())[0] + 'defects4j/analyzer/reportsanalyzer.py'
    filename = ""

    if session["tool"] == "pit":
        dir_path = dir_path = "/root/" + session["project"] + "f/tools_output/pit/"
        filetype = "*.xml"
        for file_path in os.listdir(dir_path):
            if file_path.endswith(filetype[1:]):
                filename = "/" + file_path

    cmd = ("python3 " + path + " summary -p " + session["project_name"]
                   + " -b " + session["project_version"] + " -t " + session["tool"] + " $HOME/" + session["project"] + "f/tools_output/" + session["tool"] + filename)
    
    try: 

        output = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)

    except subprocess.CalledProcessError as e:
        
        values = [0,0,0,0]
        return values

    # Define pattern to match key-value pairs
    pattern = r'([^:]+):\s+(.*)'

    # Find all matches
    matches = re.findall(pattern, output)

    # Convert matches to a dictionary
    data = {key.strip(): value.strip() for key, value in matches}

    killed_mutants = int(session["totalmutants"]) - int(data["Live mutants count"])
    mutation_score = round(float(killed_mutants/int(session["totalmutants"]))*100,2)

    values = [session["totalmutants"], killed_mutants, data["Live mutants count"], mutation_score]

    return values

def save_testsuite(data):

    save_data = {"project": session["project_name"], "version": session["project_version"], "content": data}
    
    je.create_json_save(save_data)

    path = "static/projectdata/StudentTest.java"
    
    file = open(path, "w")
    file.write(data)
    file.close()

def comment_java_file(file_path, line_number_to_comment):
    try:
        # Read the content of the file
        with open(file_path, 'r') as file:
            lines = file.readlines()

        # Check if the specified line number is within the file's length
        if 1 <= line_number_to_comment <= len(lines):
            # Comment the specified line if it's not already commented
            if not lines[line_number_to_comment - 1].strip().startswith("//"):
                lines[line_number_to_comment - 1] = "// " + lines[line_number_to_comment - 1]
        
        # Write the modified content back to the file
        with open(file_path, 'w') as file:
            file.writelines(lines)
        
        print(f"Line {line_number_to_comment} has been commented.")
    
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

def clear_table_cache(file):
    path = "/root/" + file + ".csv"

    if os.path.exists(path):
        os.remove(path)

@app.route('/', methods=['POST', 'GET'])
def index():
    #session["ids"] = pm.get_projects_id()
    session["ids"] = ['Cli', 'Gson', 'Lang']
    session["projects"] = pm.get_projects_fromjson()
    session.modified = True

    return render_template('index.html', all_data = [session["ids"], session["projects"]])

@app.route('/checkout_project', methods=['post'])
def checkout_project():
    data = request.json

    project = data['project']
    version = data['version']

    print("project: " + project + "\n")

    session["projects"].append(project + '-' + version)
    session["project_name"] = project
    session["project_version"] = version
    session.modified = True

    cmd = ("defects4j checkout -p " + project + " -v" + version + "f -w $HOME/"
                   + project + "-" + version + "f")
    os.system(cmd)

    cmd = ("defects4j compile -w $HOME/" + project + "-" + version + "f")
    os.system(cmd)

    with open("data.json") as fp:
        data = json.load(fp)

        data.append({
            "name": project + "-" + version
        })

        with open("data.json", 'w') as json_file:
            json.dump(data, json_file,
                      indent=4,
                      separators=(',', ': '))
            
    #add_junit5_to_pom(session["project"] + "f")

    return jsonify({'message': 'Project checkout successfully'}), 205

@app.route('/load_project', methods=['post'])
def load_project():
    data = request.json

    project = data['project']
    tool = data['tool']

    session["project"] = project
    session["tool"] = tool
    session["summary_data"] = ['0','0','0','0']
    session.modified = True
    sheet_data = list()

    path = get_class_path(session["project"])
    test_class = file_data(path)

    file = open("static/projectdata/test_class.java", "w")
    file.write(test_class)
    file.close()

    path = get_devsuite_path(session["project"])
    dev_suite = file_data(path)

    file = open("static/projectdata/dev_suite.java", "w")
    file.write(dev_suite)
    file.close()

    match session["tool"]:
        case "pit":
            table_header = ["Mutant", "Line", "Operator", "Method"]
            if project == "Lang-53":
                comment_java_file(path, 96)
        case "major":
            table_header = ["Mutant", "Line", "Operator", "Original", "Mutated"]
        case _:
            print("No tool selection was found.")


    session["metric_data"] = coverage()

    path = os.path.split(os.getcwd())[0] + 'defects4j/analyzer/analyzer.py'
    cmd = ("python3 " + path + " run $HOME/" + session["project"] + "f --tools " + session["tool"])
    os.system(cmd)
    path = os.path.split(os.getcwd())[0] + 'defects4j/analyzer/reportsanalyzer.py'

    match session["tool"]:
            case "pit":
                dir_path = "/root/" + session["project"] + "f/tools_output/pit/"
                filetype = "*.xml"
                filename = ""
                for file_path in os.listdir(dir_path):
                    if file_path.endswith(filetype[1:]):
                        filename = file_path
                cmd = ("python3 " + path + " table -p " + session["project_name"] + " -b "
                           + session["project_version"] + " -t " + session["tool"]
                           + " $HOME/" + session["project"] + "f/tools_output/pit/" + filename
                           + " -o " + "$HOME/results.csv")
                os.system(cmd)
            case "major":
                cmd = ("python3 " + path + " table -p " + session["project_name"] + " -b "
                           + session["project_version"] + " -t " + session["tool"]
                           + " $HOME/" + session["project"] + "f/tools_output/major/ -o "
                           + "$HOME/results.csv")
                os.system(cmd)
            case _:
                print("No tool selection was found.")

    df = load_csv("results")
    session["totalmutants"] = len(df)-1

    session.modified = True

    load_editor()

    return render_template('project.html', all_data = [session["project"], session["tool"]],
                            table_header = table_header, sheet_data = sheet_data,
                            metric_data = session["metric_data"], summary_data = session["summary_data"])

@app.route('/generate', methods=['post'])
def generate():
    data = request.json

    clear_files()
    save_testsuite(data['code'])

    student_tests = ""
    dev_tests = ""

    if data['studentTests']:
        student_tests = " -t static/projectdata/StudentTest.java"

    if data['devTests']:
        dev_tests = " --all-dev"

    if data['clearCache']:
        clear_table_cache(session["project"] + "-" + session["tool"])

    path = os.path.split(os.getcwd())[0] + 'defects4j/analyzer/analyzer.py'
    cmd = ("python3 " + path + " run $HOME/" + session["project"] + "f"+ dev_tests + student_tests + " --tools " + session["tool"])
    os.system(cmd)

    return jsonify({'message': 'Mutants generated successfully'}), 205

@app.route('/working_project', methods=['post'])
def working_project():
    data = request.json

    save_testsuite(data['code'])

    cmd = ("defects4j export -p cp.test -w $HOME/" + session["project"] + "f")
    output = subprocess.check_output(cmd, shell=True, text=True)

    match session["project"]:
        case "Cli-32":
            output = "/root/Cli-32f/target/classes:/root/Cli-32f/target/test-classes:/root/Cli-32f/file:/defects4j/framework/projects/lib/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/commons-lang/commons-lang/2.1/commons-lang-2.1.jar:/defects4j/framework/projects/Cli/lib/jdepend/jdepend/2.5/jdepend-2.5.jar:/defects4j/framework/projects/Cli/lib/junit-addons/junit-addons/1.4/junit-addons-1.4.jar:/defects4j/framework/projects/Cli/lib/junit/junit/3.8.1/junit-3.8.1.jar:/defects4j/framework/projects/Cli/lib/junit/junit/3.8.2/junit-3.8.2.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.11/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.12/junit-4.12.jar:/defects4j/framework/projects/Cli/lib/junit/junit/4.8.2/junit-4.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/junit-addons/junit-addons/1.4/junit-addons-1.4.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/3.8.1/junit-3.8.1.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/3.8.2/junit-3.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.11/junit-4.11.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.12/junit-4.12.jar:/defects4j/framework/projects/Cli/lib/lib/junit/junit/4.8.2/junit-4.8.2.jar:/defects4j/framework/projects/Cli/lib/lib/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar:/defects4j/framework/projects/Cli/lib/org/hamcrest/hamcrest-core/1.3/hamcrest-core-1.3.jar"
    
    path = "static/projectdata/StudentTest.java"

    cmd = ["javac", "-classpath", output, path]

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) 

    stdout, stderr = process.communicate()

    stdout = stdout.decode('utf-8')
    stderr = stderr.decode('utf-8')

    if process.returncode == 0:
        return jsonify({'message': "Compilation succeeded."})
    else:
        return jsonify({'message': "Compilation failed with return code: " + str(process.returncode) + "\n" + stderr})

@app.route('/project_versions', methods=['post'])
def project_versions():
    data = request.json

    #versions = pm.get_project_versions(data['project'])
    
    versions = list()

    match str(data['project']):
        case 'Cli':
            versions = ['32']
        case 'Gson':
            versions = ['15']
        case 'Lang':
            versions = ['53']
        case _:
                print("No project selection was found.")

    return jsonify({'versions': versions}), 200

@app.route('/analyze', methods=['post'])
def analyze():
    path = os.path.split(os.getcwd())[0] + 'defects4j/analyzer/reportsanalyzer.py'
    sheet_data = list()

    if os.path.exists("/root/results.csv"):
        os.remove("/root/results.csv")

    match session["tool"]:
            case "pit":
                dir_path = "/root/" + session["project"] + "f/tools_output/pit/"
                filetype = "*.xml"
                filename = ""
                for file_path in os.listdir(dir_path):
                    if file_path.endswith(filetype[1:]):
                        filename = file_path
                cmd = ("python3 " + path + " table -p " + session["project_name"] + " -b "
                           + session["project_version"] + " -t " + session["tool"]
                           + " $HOME/" + session["project"] + "f/tools_output/pit/" + filename
                           + " -o " + "$HOME/results.csv")
                os.system(cmd)
            case "major":
                cmd = ("python3 " + path + " table -p " + session["project_name"] + " -b "
                           + session["project_version"] + " -t " + session["tool"]
                           + " $HOME/" + session["project"] + "f/tools_output/major/ -o "
                           + "$HOME/results.csv")
                os.system(cmd)
            case _:
                print("No tool selection was found.")

    store_csv()
    df1 = load_csv(session["project"] + "-" + session["tool"])
    table_header = list()

    match session["tool"]:
            case "pit":
                sheet_data = pit_parse(df1)
                table_header = ["Mutant", "Line", "Operator", "Method"]
            case "major":
                sheet_data = major_parse(df1)
                table_header = ["Mutant", "Line", "Operator", "Original", "Mutated"]
            case _:
                print("No tool selection was found.")

    df2 = load_csv("results")
    killed_list = csv_compare(df1, df2)
        
    session["summary_data"] = summary()
    session.modified = True

    return render_template('project.html', all_data = [session["project"], session["tool"]],
                            table_header = table_header, sheet_data = sheet_data, killed_list = killed_list,
                            metric_data = session["metric_data"], summary_data = session["summary_data"])


if (__name__ == '__main__'):
    app.run(host='0.0.0.0', port=int('8000'), debug=True)