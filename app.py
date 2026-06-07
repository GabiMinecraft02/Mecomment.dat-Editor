from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def homepage():
  return render_template("index.html")

@app.route("/open")
def open_file():
  return render_template("open.html")

@app.route("/editor")
def editor():
  return render_template("editor.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
