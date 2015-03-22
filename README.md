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

| Token          | Example                    | Description                      |
|----------------|----------------------------|----------------------------------|
| `%f`           | `myfile.foo`               | File name                        |
| `%p`           | `/foo/bar/baz/myfile.foo`  | File path                        |
| `%b`           | `myfile`                   | File name without extension      |
| `%e`           | `foo`                      | File extension                   |
| `{{name}}`     | `myfile.foo`               | File name                        |
| `{{path}}`     | `/foo/bar/baz/myfile.foo`  | File path                        |
| `{{dir}}`      | `/foo/bar/baz`             | The dir portion of the full path |
| `{{base}}`     | `myfile`                   | File name without extension      |
| `{{basename}}` | `myfile`                   | File name without extension      |
| `{{ext}}`      | `foo`                      | File extension                   |
