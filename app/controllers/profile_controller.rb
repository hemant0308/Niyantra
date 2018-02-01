class ProfileController < ApplicationController
	def update_password
		user=user = User.find_for_authentication(email: current_user['email'])
		old_password = params[:old]
		if user.valid_password? old_password 
			res = user.update(password_params)
		end
		if res
			sign_in(user)
			byebug
			flash[:notice] = 'updated successfully'
			redirect_to root_path
		end
	end
	private
	def password_params
		params.permit(:password,:password_confirmation)
	end
end
