class ImagesController < ApplicationController
  def index
    @images = Image.all
  end

  def new
      @image = Image.new
  end

  def create
      @image = Image.new(image_params)
      tag = params[:image][:tag]
      genre_names = extract_genre_names(tag)
      genres = find_or_create_genres_by_names(genre_names)
      @image.genres = genres
      if @image.save
        # 保存に成功した場合の処理
        redirect_to root_path
      else
        # 保存に失敗した場合の処理
        render :new
      end
  end

  def edit
      @image = Image.find(params[:id])
  end

  def destroy
    @image = Image.find(params[:image_id])
    @image.destroy
    # turboのせいでリダイレクトが機能しない空クライアント側でリダイレクトを強制。解決法教えて
    redirect_to root_path
  end
  
  def show
    @image = Image.find(params[:image_id])
    if @image.user_id == current_user.id 
      render turbo_stream: turbo_stream.replace("imageShow", partial: 'images/myPost' , locals: { image: @image })
    else 
      render turbo_stream: turbo_stream.replace("imageShow", partial: 'images/otherPost' , locals: { image: @image })
    end
  end

  private
  def image_params
      params.require(:image).permit(:post_image, :comment, :user_id, :latitude, :longitude, :visibility_id)
    end

  def set_image
    @image = Image.find(params[:id])
  end
    

  # コメントからジャンル名を抽出するメソッド
  def extract_genre_names(tag)
    return [] if tag.blank?
    tag.scan(/#[\p{Word}]+/).map { |name| name.gsub('#', '') }
  end

  # ジャンル名に基づいてジャンルを検索または作成するメソッド
  def find_or_create_genres_by_names(names)
    names.map do |name|
      Genre.find_or_create_by(name: name)
    end
  end
end
