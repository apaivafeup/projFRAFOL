from flask import Flask, request, jsonify
from flask_cors import CORS


import projectmanager as pm
from helpers import file_helper, kill_matrix, file_paths
from models.projects.factory import make_project
from models.tools.factory import make_tool
from models.Project import Project




app = Flask(__name__)

# CORS Configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

avaliable_projects = ['Cli', 'Gson', 'Lang', 'Jsoup', 'Math', 'Compress']

def file_data(path):
    data = str()
    with open(path, encoding='utf-8') as f:
        data = f.read()

    return data

def save_testsuite(data):
    file = open(file_paths.student_test_file_path, "w")
    file.write(data)
    file.close()


@app.route('/get_avaliable_projects', methods=['GET'])
def get_avaliable_projects():
    return jsonify({'projects_to_import' : avaliable_projects, 'projects_to_open': pm.get_opened_projects()}), 200  

@app.route('/project_versions', methods=['post'])
def project_versions():
    data = request.json
    versions = make_project(data['project']).available_versions

    return jsonify({'versions': versions}), 200


@app.route('/import_project', methods=['POST'])
def import_project():
    new_import_project = request.json
    project_name = new_import_project['project']
    version = new_import_project['version']

    imported_project: Project = make_project(project_name, version)
    imported_project.checkout_with_defects4j()
    imported_project.compile_with_defects4j()

    return jsonify({'projects_to_open': pm.get_opened_projects() }), 200

@app.route('/open_project', methods=['POST'])
def load_project():
    data = request.json
    project = data['project']
    tool = data['tool']

    project_name, version = project.split("-")
    opened_project : Project = make_project(project_name, version, make_tool(tool))

    path = opened_project.get_class_path()
    test_class = file_data(path)

    dev_suite = file_helper.read_file_if_exists("tmp/" + project + "/dev.java")
    if dev_suite is None:
        path = opened_project.get_devsuite_path()
        dev_suite = file_data(path)
        file_helper.write_to_file(dev_suite, "tmp/" + project + "/dev.java")

    table_header = opened_project.get_mutant_table_headers()
    metric_data, coverage_data = opened_project.get_project_data()

    return jsonify({
        'project': project,
        'tool': tool,
        'table_header': table_header,
        'metric_data': metric_data,
        'summary_data': ['0', '0', '0', '0'],
        'test_class': test_class,
        'dev_suite': dev_suite,
        'coverage_data': coverage_data
    }), 200

@app.route('/compile', methods=['post'])
def compile():
    data = request.json
    project = data['project']

    save_testsuite(data['code'])

    project_name, version = project.split("-")
    project: Project = make_project(project_name, version)

    return project.compile()

@app.route('/analyze_mutants', methods=['post'])
def generate_mutants():
    data = request.json
    project = data['project']
    tool = data['tool']
    with_student_tests = data['withStudentTests']

    project_name, version = project.split("-")
    project: Project = make_project(project_name, version, make_tool(tool))


    if with_student_tests:
        save_testsuite(data['code'])
    else:
        is_not_first_mutations_analysis = project.is_dev_suite_mutated()
        if is_not_first_mutations_analysis:
            return jsonify({'message': 'Skipping analysis - already performed.'}), 204
    
    sheet_data, table_header, killed_list = project.analyze_mutants(with_student_tests)
    summary_data = project.get_project_mutation_summary()

    return jsonify({
        'table_header': table_header,
        'sheet_data': sheet_data,
        'killed_list': killed_list,
        'summary_data': summary_data,
    }), 200

@app.route('/generate_kill_matrix', methods=['post'])
def generate_kill_matrix():
    data = request.json
    project = data['project']
    tool = data['tool']

    project_name, version = project.split("-")
    tool = make_tool(tool)
    project: Project = make_project(project_name, version, tool)

    save_testsuite(data['code'])
    matrix, all_killed_mutants = kill_matrix.generate_kill_matrix(project, tool)

    return jsonify({
        'kill_matrix': matrix,
        "all_killed_mutants" : all_killed_mutants,
    }), 200



if (__name__ == '__main__'):
    app.run(host='0.0.0.0', port=int('8000'), debug=True)