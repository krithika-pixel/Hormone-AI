import os
from flask import Flask, render_template, request, redirect, session, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("SECRET_KEY", "supersecretkey")

try:
    os.makedirs(app.instance_path, exist_ok=True)
except OSError:
    # In serverless environments like Vercel, the local project directory may be read-only.
    pass

default_db_path = os.path.join(os.environ.get("TMPDIR", "/tmp"), "hormone_ai.db")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
    "DATABASE_URL", f"sqlite:///{default_db_path}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))

@app.route("/")
def home():
    active_tab = request.args.get("tab", "login")
    if active_tab not in ("login", "register"):
        active_tab = "login"
    return render_template("index.html", active_tab=active_tab, user=session.get('user'))

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        if User.query.filter_by(email=email).first():
            flash("Email already registered. Use another email or log in.")
            return redirect(url_for("home", tab="register"))

        user = User(
            name=request.form["name"],
            email=email,
            password=generate_password_hash(request.form["password"]),
        )
        db.session.add(user)
        db.session.commit()
        session["user"] = user.email
        flash("Account created successfully! Welcome to HormoneAI.")
        return redirect(url_for("home"))

    return redirect(url_for("home", tab="register"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = User.query.filter_by(email=request.form["email"]).first()
        if user and check_password_hash(user.password, request.form["password"]):
            session["user"] = user.email
            return redirect(url_for("dashboard"))
        flash("Invalid email or password.")
        return redirect(url_for("home", tab="login"))

    return redirect(url_for("home", tab="login"))

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))

    user = User.query.filter_by(email=session["user"]).first()
    return render_template(
        "dashboard.html", user_name=user.name if user else session["user"]
    )

@app.route("/logout")
def logout():
    session.pop("user", None)
    flash("You have been logged out.")
    return redirect(url_for("login"))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))