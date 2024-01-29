// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// メモ、rails7移行では、rails-ujsは廃止されて、turboがデフォルトになったから、link_toでpostが使えない。代わりにturboを使う<%= link_to chat_rooms_path(params: { user_id: user.id }), data: { "turbo-method": :post }, class: "no-underline" %> 