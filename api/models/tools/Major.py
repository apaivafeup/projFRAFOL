import ast
import os
import re
import subprocess

import pandas as pd
from models.Tool import Tool
from helpers import defects4j_helper as d4hj
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Major(Tool):

    def __init__(self):
        super().__init__("major")

    def get_mutant_table_headers(self):
        return ["Mutant", "Line", "Operator", "Original", "Mutated"]

    def run_analysis(self, project):
        path = d4hj.get_reports_analyzer_path()
        project_name, project_version = project.split("-")
        cmd = ("python3 " + path + " table -p " + project_name + " -b "
                   + project_version + " -t " + self.name
                   + " $HOME/" + project + "f/tools_output/major/ -o "
                   + "$HOME/results.csv")
        try:
            os.system(cmd)
        except subprocess.CalledProcessError as e:
            raise Exception(f"MAJOR: Error Major Mutant Run Analysis: {e.output}")


    def get_mutant_table_data(self, df, project = None):
        return self.parse_major_dataframe(df)
    
    def get_mutation_summary(self, project):
        path = d4hj.get_reports_analyzer_path()
        filename = ""

        project_name, project_version = project.split("-")

        cmd = ("python3 " + path + " summary -p " + project_name
                    + " -b " + project_version + " -t " + self.name + " $HOME/" + project + "f/tools_output/" + self.name + filename)
        
        try:
            output = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as e:
            values = [0,0,0,0]
            return values
        
        pattern = r'([^:]+):\s+(.*)'
        matches = re.findall(pattern, output)
        return {key.strip(): value.strip() for key, value in matches}

    def get_kill_matrix(self, project):
        return []
    

    def parse_major_dataframe(self, df):
        # Remove potential header-like row accidentally included in data
        df = df[df["Mutant"] != "Mutant"]

        mutant_list = df["Mutant"].tolist()
        line_list = []
        operator_list = []
        original_list = []
        mutated_list = []

        for _, row in df.iterrows():
            details = ast.literal_eval(row['Details'])
            line_list.append(details.get('line'))
            operator_list.append(details.get('operator'))
            original_list.append(details.get('original'))
            mutated_list.append(details.get('mutated'))

        sheet_data = list(zip(mutant_list, line_list, operator_list, original_list, mutated_list))

        return sheet_data
    

    def get_mutants_killed_by_test(self, project):
        tool_output_csv = "/root/" + project + "f/tools_output/major/"
        
        csv_files = [f for f in os.listdir(tool_output_csv) if f.endswith('.csv')]
        if not csv_files:
            raise Exception("No CSV files found in the specified path")
        
        csv_file = csv_files[0]
        df = pd.read_csv(tool_output_csv + csv_file, header=0)
        
        fail_mutants = df[df.iloc[:, 1] == 'FAIL']['MutantNo'].astype(str).tolist()

        log_files = [f for f in os.listdir(tool_output_csv) if f.endswith('.log')]
        if not log_files:
            raise Exception("No log files found in the specified path")
        
        log_file = log_files[0]
        killed_mutants = []

        with open(tool_output_csv + log_file, 'r') as file:
            log_lines = file.readlines()
            for line in log_lines:
                parts = line.strip().split(':')
                
                if len(parts) >= 6:
                    mutant_number = parts[0].strip()
                    operator = parts[1].strip()
                    method = parts[4].strip()
                    code_line = parts[5].strip()

                    if mutant_number in fail_mutants:
                        killed_mutants.append({
                            "line": code_line,
                            "operator": operator,
                            "method": method
                        })

        mutant_ids_csv = "/root/" + project + "-major.csv"
        df = pd.read_csv(mutant_ids_csv, header=0, names=["mutantId", "details"])

        killed_mutants_ids = []

        for mutant in killed_mutants:
            line_number = int(mutant['line'])
            method = mutant['method']
            operator = mutant['operator']

            for index, row in df.iterrows():
                details = eval(row['details'])
                if details['line'] == line_number and details['signature'] == method and details['operator'] == operator:
                    mutant_id = row['mutantId']
                    killed_mutants_ids.append(mutant_id)

        return killed_mutants_ids



