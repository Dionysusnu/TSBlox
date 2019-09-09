workflow "Create Slate Documentation On Push" {
  on = "push"
  resolves = ["Build Documentation"]
}

action "Build Documentation" {
  uses = "decathlon/slate-builder-action@master"
  env = {
     DOC_BASE_FOLDER = "./docs"
  }
}

action "Deploy documentation to GitHub Pages" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = "Slate Documentation builder"
  env = {
    BUILD_DIR = "docs/build/"
  }
  secrets = ["GH_PAT"]
}