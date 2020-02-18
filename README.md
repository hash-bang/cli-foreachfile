ForEachFile
===========
Simple CLI utility to recursively execute a command for each matching file.

Examples:

```
# Visit each .tar file (setting the directory to its location) and untar:
> each '**/*.tar' -- tar xvf %f

# Convert all .jpg images to .png
> each '**/*.jpg' -- convert %b.jpg %b.png
```

Usage
-----
```
Usage: each [glob] -- <command>

Options:
  -V, --version            output the version number
  -c, --command <string>   Explicitally specify the command to run
  -d, --dir                Change into each files directory before executing
  -n, --dry-run            Do not run anything, instead show what would be run
                           -implies `-v`
  -g, --glob <expr>        Explicitally specify the glob to use
  -l, --log <expr>         Log text before each execution (default:
                           "${colors.blue('[File]')} %r")
  -p, --parallel <number>  Specify the number of processes to run in parallel
                           (default: 1)
  -v, --verbose            Be verbose
  -h, --help               output usage information

Notes:
  * Command arguments and log output can use ES6 templates or simple percentage prefix characters

Examples:

  # List all basenames from this directory recursively
  each '**/*' -- echo %f

  # Convert all JPG images into PNG
  each '**/*.jpg' -- convert %b.jpg %b.png
```


Installation
------------
Install globally with NPM:

```
sudo npm install -g cli-foreachfile
```


Command expansion
-----------------
Commands can be written in a variety of ways. Each of the below tokens gets expanded into the value shown.

| Category       | Token           | Example                    | Description                      |
|----------------|-----------------|----------------------------|----------------------------------|
| File           | `%b`            | `myfile.foo`               | File name                        |
| "              | `%f`            | `myfile.foo`               | File name                        |
| "              | `{{name}}`      | `myfile.foo`               | File name without extension      |
| "              | `{{base}}`      | `myfile`                   | File name                        |
| "              | `{{basename}}`  | `myfile`                   | File name                        |
| "              | `{{relative}}`  | `./myfile.foo`,            | File name relative to PWD        |
| "              | `%r`            | `./myfile.foo`,            | File name relative to PWD        |
| File Info      | `%e`            | `foo`                      | File extension                   |
| "              | `{{ext}}`       | `foo`                      | File extension                   |
| Directory      | `%d`            | `/foo/bar/baz/myfile.foo`  | Relative dir to pwd              |
| "              | `{{dir}}`       | `/foo/bar/baz`             | The dir portion of the full path |
| "              | `{{dirname}}`   | `/foo/bar/baz`             | The dir portion of the full path |
| Full Path      | `%p`            | `/foo/bar/baz/myfile.foo`  | Full File path                   |
| "              | `{{path}}`      | `/foo/bar/baz/myfile.foo`  | Full File path                   |
| Utilities      | `{{colors}}`    |                            | [Chalk](https://github.com/chalk/chalk) Instance |
|                | `{{path}}`      |                            | [Path](https://nodejs.org/api/path.html) NodeJS Core Instance |
