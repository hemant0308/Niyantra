class ProfileController < ApplicationController
	def update_password
		user=user = User.find_for_authentication(email: current_user['email'])
		old_password = params[:old]
		if user.valid_password? old_password 
			res = user.update(password_params)
		end
		if res
			sign_in(user)
			
			flash[:notice] = 'updated successfully'
			redirect_to root_path
		end
	end
	def profile
		@shopname = current_shop['name']
		@name = current_user.name

	end
	def update
		name = params[:name]
		shopname = params[:shopname]
		current_user.name = name
		res = Shop.update(current_shop['id'],:name=>shopname)
		current_user.save
		session[:shop] = res
		redirect_to profile_path
	end
	private
	def password_params
		params.permit(:password,:password_confirmation)
	end
end
