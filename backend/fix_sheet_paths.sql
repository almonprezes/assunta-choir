UPDATE sheet_music SET file_path = REPLACE(file_path, 'C:\Users\norbe\CascadeProjects\Assunta\CascadeProjects\windsurf-project\backend\', '');
UPDATE sheet_music SET file_path = REPLACE(file_path, '\', '/');
