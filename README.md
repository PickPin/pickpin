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
登録されてないユーザー情報を入力してログインformを提出すると、新規登録画面に飛ばされる。