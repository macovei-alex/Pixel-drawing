import os


def merge_files(folder_path: str, output_file_path: str, do_print: bool = False):
    with open(output_file_path, 'w') as output_file:
        for file_name in os.listdir(folder_path):

            file_path = os.path.join(folder_path, file_name)

            if file_path == output_file_path:
                continue

            if os.path.isfile(file_path):
                with open(file_path, 'r') as input_file:
                    contents = input_file.read()
                    contents_string = [line.removeprefix('export ') for line in str(contents).split('\n')
                                       if line.find('import') == -1]

                    joined_content: str = '\n'.join(contents_string)

                    if do_print:
                        print(joined_content)
                        print('----------------------')

                    output_file.write(joined_content)

                print("Merged file:", file_name)


folder_path: str = os.path.abspath('../src')
output_file_path: str = os.path.abspath(
    folder_path.removesuffix('src') + '/merged.js')

print()
print('Folder path to source files: ' + folder_path)
print('File path for the merged file: ' + output_file_path)

merge_files(folder_path, output_file_path)
