name: builddocs
# This workflow is triggered on pushes to the repository.
on: [push]

jobs:
  build:
    # Job name is Greeting
    name: jsdocbuilder
    # This job runs on Linux
    runs-on: ubuntu-latest
    steps:
      - uses: dionysusnu/jsdoc-builder
      # This step prints the time.
      - run: echo The time was ${{ steps.hello.outputs.time }}