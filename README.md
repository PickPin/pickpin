#エンドポイント参照用


# ユーザー登録：
新規登録：GET /users/sign_up （新規登録フォーム）
アカウント作成：POST /users （登録処理）
セッション（ログイン・ログアウト）：

# ログインフォーム：GET /users/sign_in
ログイン処理：POST /users/sign_in
ログアウト：DELETE /users/sign_out
パスワード：

# パスワード変更要求フォーム：GET /users/password/new
パスワード変更要求：POST /users/password
パスワード変更フォーム：GET /users/password/edit
パスワード変更：PUT /users/password
アカウント編集・削除：

# アカウント編集フォーム：GET /users/edit
アカウント情報更新：PUT /users
アカウント削除：DELETE /users
認証キーによる認証：

認証メール再送：GET /users/confirmation/new
認証メール送信：POST /users/confirmation
メールアドレス認証：GET /users/confirmation
ロック解除：

ロック解除要求フォーム：GET /users/unlock/new
ロック解除要求：POST /users/unlock
アカウントのロック解除：GET /users/unlock

## ログイン認証機能用パッケージdeviceの仕様メモ
ログイン状態でログイン、サインインページに飛ぼうとすると/index.rbに戻される。

## デバック用アカウント
email:sample@gmail.com
password:password(このパスワードだと警告出るけど無視してok)

## deviceによりコントローラーで使用可能になった変数、メソッド

## 現在のユーザー情報
current_user:
現在ログインしているユーザーのオブジェクトを返す。
例: current_user.email でログイン中のユーザーのメールアドレスを取得できる。

user_signed_in?:
ユーザーがログインしているかどうかを真偽値で返す。
例: user_signed_in? が true ならユーザーはログインしている。

## 認証関連
authenticate_user!:
このメソッドはコントローラーでフィルタとして使用され、ユーザーがログインしていない場合はログインページにリダイレクトする。

例: コントローラの before_action で authenticate_user! を設定することで、特定のアクションを実行する前にユーザーのログインを要求できる。

## ログイン・ログアウト
sign_in(resource_or_scope, *args):
プログラム的にユーザーをログインさせる。

sign_out(resource_or_scope):
プログラム的にユーザーをログアウトさせる。

## ユーザーセッション
user_session:
現在のユーザーセッションにアクセスするためのメソッド。セッション固有のデータを扱う場合に使う。