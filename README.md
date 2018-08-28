# Documentation for GITB TDL

The GITB TDL documentation is built using restructured text and Sphinx. The theme used is the RTD (Read The Docs theme).

## Installation

Installation process described at: http://www.sphinx-doc.org/en/master/usage/installation.html

### Step 1

Download and install python. On windows do this get the installer from https://www.python.org/downloads/ (currently version 3.* is used).

On Linux do:

```
apt-get update
apt-get install -y python-pip python-dev build-essential
```

### Step 2

Install Sphinx `pip install -U sphinx`

### Step 3

Verify installation with `sphinx-build --version`

### Step 4

Install RTD theme: `pip install sphinx_rtd_theme`.
This is then used as "sphinx_rtd_theme"

## Use

To generate the HTML documentation issue (from the current folder): `make html`. The output is stored in folder "build"
To fully cleanup the produced documentation: `make clean`.

