
controller = 'app/controllers/'${ARGS}'Controller'.js
router = 'app/routes/'${ARGS}'Router'.js
model = 'app/models/'${ARGS}.js

sync:
	git pull
	npm i
	npm start
	
create:
	touch $(controller)
	touch $(router)
	touch $(model)
	
delete:
	rm $(controller)
	rm $(router)
	rm $(model)