ForEachFile
===========
Simple CLI utility to recursively execute a command for each matching file.

Examples:

	# Visit each .tar file (setting the directory to its location) and untar:

	each '**/*.tar' -- tar xvf %f


	# Convert all .jpg images to .png
	
	each '**/*.jpg' -- convert %b.jpg %b.png


See the main `--help` page for more information.


Installation
------------

	sudo npm install -g cli-foreachfile


Command expansion
-----------------
Commands can be written in a varity of ways. Each of the below tokens gets expanded into the value shown.

| Category       | Token           | Example                    | Description                      |
|----------------|-----------------|----------------------------|----------------------------------|
| File           | `%f`            | `myfile.foo`               | File name                        |
| "              | `{{name}}`      | `myfile.foo`               | File name                        |
| "              | `{{base}}`      | `myfile`                   | File name without extension      |
| "              | `{{basename}}`  | `myfile`                   | File name without extension      |
| File Info      | `%b`            | `myfile`                   | File name without extension      |
| "              | `%e`            | `foo`                      | File extension                   |
| "              | `{{ext}}`       | `foo`                      | File extension                   |
| "              | `{{nameNoExt}}` | `myfile`                   | File name without extension      |
| Directory      | `%d`            | `/foo/bar/baz/myfile.foo`  | Relative dir to pwd              |
| "              | `{{dir}}`       | `/foo/bar/baz`             | The dir portion of the full path |
| "              | `{{dirname}}`   | `/foo/bar/baz`             | The dir portion of the full path |
| Full Path      | `%p`            | `/foo/bar/baz`             | Relative dir to pwd              |
| "              | `%r`            | `/foo/bar/baz/myfile.foo`  | Full, resolved absolute path     |
| "              | `{{path}}`      | `/foo/bar/baz/myfile.foo`  | File path                        |
| "              | `{{resolved}}`  | `/foo/bar/baz/myfile.foo`  | Full, resolved absolute path     |
