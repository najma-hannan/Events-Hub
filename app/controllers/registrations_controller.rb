class RegistrationsController < ApplicationController
  skip_before_action :authenticate_user, only: :create

  def create
    user = User.new(user_params)
    if user.save
      token = JwtService.encode_token(user_id: user.id)
      render json: { user: user, token: token }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
