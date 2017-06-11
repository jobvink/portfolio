$(function () {

	document.querySelector('a-scene').addEventListener('enter-vr', function () {
		$('nav').hide();
	});
	document.querySelector('a-scene').addEventListener('exit-vr', function () {
		$('nav').show();
	});

	var pickupSound = new Audio('assets/audio/pickup2.mp3'),
		radiotuneSound = new Audio('assets/audio/radiotune.mp3');

    window.scrollTop = 0;

    var scene = document.querySelector('a-scene').object3D;  // THREE.Scene
    var spotLight = new THREE.SpotLight( 0xffffff, 0.7, 156, 0.5, 0.3, 1);
    spotLight.position.set( 0, 10, 0 );
    spotLight.target.position.set(0, 2, -20);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight.target );
    scene.add( spotLight );

    if (window.location.hash) {
        //bind to scroll function
        $(document).scroll( function() {
            var hash = window.location.hash;
            var hashName = hash.substring(1, hash.length);
            var element;

            //if element has this id then scroll to it
            if ($(hash).length != 0) {
                element = $(hash);
            }
            //catch cases of links that use anchor name
            else if ($('a[name="' + hashName + '"]').length != 0)
            {
                //just use the first one in case there are multiples
                element = $('a[name="' + hashName + '"]:first');
            }

            //if we have a target then go to it
            if (element != undefined) {
                window.scrollTo(0, element.position().top);
            }
            //unbind the scroll event
            $(document).unbind("scroll");
        });
    }

    //radio
	var radio = document.getElementById('radio');
    var audio = new Audio();
    audio.volume=.5;

    audio.addEventListener("ended", function(){
        audio.currentTime = 0;
        console.log("ended");
    });

    $(radio).on('click', function () {
        if (audio.duration > 0 && !audio.paused) {
            audio.pause();
        } else {
            getAudio();
        }
    });

    function getAudio(){
    	radiotuneSound.play();
        $.ajax({
            url: 'http://maartenpaauw.com/school/bas-api/',
            method: 'GET',
            dataType: 'JSON',
            success: function (response) {
                setTimeout(function(){
                    radiotuneSound.pause();
                    radiotuneSound.currentTime = 0;
                    audio = new Audio(response.url);
                    audio.play();
				}, 3000);
            }
        });
    }

	function Checkout() {
		this.makeCheckout = function () {
			var price_list = $('#price_list tbody');
			price_list.html('');
			var componenten = [],
				totaal = 0;

			componenten = [fiets.getFrame(), fiets.getStuur(), fiets.getWiel_v(), fiets.getWiel_a(), fiets.getZadel()];
			var prijs_beschrijving = [];
			for(i = 0; i < componenten.length; i++){
				if(componenten[i]){
					prijs_beschrijving.push([componenten[i].getPrijs(), componenten[i].getBeschrijving()]);
				}
			}

			for(i = 0; i<prijs_beschrijving.length; i++) {
				var part = prijs_beschrijving[i][1],
					price = prijs_beschrijving[i][0];

				totaal = totaal + price;


				price_list.append('<tr>' +
					'<td>' + part + '</td>' +
					'<td>&euro;' + price + '</td></tr>');
			}

			price_list.append('<tr>' +
				'<th>Totaal</th>' +
				'<th>&euro;' + totaal + '</th></tr>');

			$('#checkoutmodal').modal('show');
		};
		this.makeMsg = function () {
			var camera_active = document.getElementById("camera_active");
			var thecamera = document.getElementById('camera');
			var checking_out = document.getElementById('checking_out');
			camera_active.setAttribute("visible", "false");
			checking_out.setAttribute('visible', 'true');
			spotLight.visible = false;
			var opacity = 0;
			for(i=0;i<100;i++){
				setTimeout(function () {
					opacity+=0.01;
					for(j = 0; j < checking_out.children.length; j++){
						checking_out.children[j].setAttribute("opacity", opacity.toString());
					}
				}, i*5);
			}
			document.querySelector('a-scene').exitVR();

			setTimeout(function () {
				checkout.makeCheckout();
				camera_active.setAttribute("visible", "true");
				checking_out.setAttribute("visible", "false");
				spotLight.visible = true;
			}, 5000);
		}
	}
	var checkout = new Checkout();

	function Camera() {
		this.obj = null;
		this.hasObj = false;

		this.setObj = function (obj) {
			this.obj = obj;
			this.appendCameraObj(obj);
            pickupSound.play();

		};
		this.getObj = function () {
			return this.obj;
		};
		this.appendCameraObj = function (obj) {
			var theCamera = document.getElementById('camera_obj');
			theCamera.setAttribute("collada-model", obj.getModel());
			theCamera.setAttribute("scale", {x:1, y:1, z:1});
			theCamera.setAttribute("position", {x:0, y:0.5, z:-3});
			this.hasObj = true;
		};
		this.removeObject = function () {
			var theCamera = document.getElementById('camera_obj');
			theCamera.removeAttribute("collada-model");
			theCamera.removeAttribute("scale");
			theCamera.removeAttribute("position");
			placer.removePlaces();
			this.hasObj = false
		};
		this.hasObject = function(){
			return this.hasObj
		};
	}
	var camera = new Camera();

	function Fiets() {
		this.frame = null;
		this.wiel_v = null;
		this.wiel_a = null;
		this.stuur = null;
		this.zadel = null;

		this.getFrame = function () {
			return this.frame;
		};
		this.setFrame = function (obj) {
			this.frame = obj;
			create(this.frame, "fiets");
			if(this.wiel_v){create(this.wiel_v, "wiel_voor")}
			if(this.wiel_a){create(this.wiel_a, "wiel_achter")}
			if(this.stuur){create(this.stuur, "stuur")}
		};
		this.getWiel_v = function () {
			return this.wiel_v;
		};
		this.setWiel_v = function (obj) {
			this.wiel_v = obj;
			create(this.wiel_v, "wiel_voor");
		};
		this.getWiel_a = function () {
			return this.wiel_a;
		};
		this.setWiel_a = function (obj) {
			this.wiel_a = obj;
			create(this.wiel_a, "wiel_achter");
		};
		this.getStuur = function () {
			return this.stuur;
		};
		this.setStuur = function (obj) {
			this.stuur = obj;
			create(this.stuur, "stuur");
		};
		this.getZadel = function () {
			return this.zadel;
		};
		this.setZadel = function (obj) {
			this.zadel = obj;
			create(this.zadel, "zadel");
		}
	}
	var fiets = new Fiets();


	function PrevControl() {
		this.id = 'prevContorl';

		this.makeControl = function (x) {
			//return '<a-entity selectable id="'+ this.id+'" geometry="primitive:plane; width:3; height:3;" material="src:#prev_img" position="' + x + ' 0 0"></a-entity>'
			return '<a-entity selectable id="'+ this.id +'" position="'+ x +' 0 0"> <a-circle color="#CCC" radius="1.5"></a-circle> <a-plane color="black" width="0.5" height="1.5" position="-0.2 0.35 0.01" rotation="0 0 -45"></a-plane> <a-plane color="black" width="0.5" height="1.5" position="-0.2 -0.35 0.01" rotation="0 0 -135"></a-plane> </a-entity>'
		};
		this.getId = function () {
			return this.id;
		};
		this.execute = function () {
			menu.prevMenu();
		}
	}
	PrevControl.prototype = new Control();

	function NextControl() {
		this.id = 'nextControl';

		this.makeControl = function (x) {
			// return '<a-entity selectable id="'+ this.id+'" geometry="primitive:plane; width:3; height:3;" material="src:#next_img" position="' + x + ' 0 0"></a-entity>'
			return '<a-entity selectable id="'+ this.id +'" position="'+ x +' 0 0" rotation="0 0 180"> <a-circle color="#CCC" radius="1.5"></a-circle> <a-plane color="black" width="0.5" height="1.5" position="-0.2 0.35 0.01" rotation="0 0 -45"></a-plane> <a-plane color="black" width="0.5" height="1.5" position="-0.2 -0.35 0.01" rotation="0 0 -135"></a-plane> </a-entity>'
		};
		this.getId = function () {
			return this.id;
		};
		this.execute = function () {
			menu.nextMenu();
		}

	}
	NextControl.prototype = new Control();

	function RemoveControl() {
		this.id = 'removeControl';

		this.makeControl = function (x) {
			return '<a-entity selectable id="'+ this.id +'" position="'+ x +' 0 0"><a-circle color="#CCC" radius="1.5"></a-circle><a-image width="2.2" height="2.2" src="assets/img/bin.png" position="0 0 0.1"></a-image></a-entity>'
		};
		this.getId = function () {
			return this.id;
		};
		this.execute = function () {
			camera.removeObject();
		}
	}
	RemoveControl.prototype = new Control();

	function StartControl() {
		this.id = 'startControl';

		this.makeControl = function (x) {
			return '<a-entity selectable id="'+ this.id +'" position="'+ x +' 0 0"><a-circle color="#CCC" radius="1.5"></a-circle><a-image width="2.2" height="2.2" src="assets/img/start.png" position="0 0 0.1"></a-image></a-entity>'
		};
		this.getId = function () {
			return this.id;
		};
		this.execute = function () {
			menu.nextMenu();
		}
	}
	StartControl.prototype = new Control();

	function CheckoutControl() {
		this.id = 'checkoutControl';

		this.makeControl = function (x) {
			//return '<a-entity selectable id="'+ this.id+'" geometry="primitive:plane; width:3; height:3;" material="src:#checkout_img" position="' + x + ' 0 0"></a-entity>'
			return '<a-entity selectable id="'+ this.id +'" position="'+ x +' 0 0"><a-circle color="#CCC" radius="1.5"></a-circle><a-image width="2.2" height="2.2" src="assets/img/cart.png" position="0 0 0.1"></a-image></a-entity>'
		};
		this.getId = function () {
			return this.id;
		};
		this.execute = function () {
			checkout.makeMsg();
		}
	}
	CheckoutControl.prototype = new Control();

	function Control() {}

	function Menu() {
		this.state = 0;
		this.menu_holder = document.getElementById("menu_holder");
		this.menuIds = [];

		this.removeMenu = function(){
			for(i = 0; i < this.menuIds.length; i++){
				var menuItem = document.getElementById(this.menuIds[i]);
				$(menuItem).remove();
			}
			this.menuIds = [];
		};

		this.nextMenu = function(){
			this.state++;
			this.removeMenu();
			this.make();
		};
		this.prevMenu = function () {
			this.state--;
			this.removeMenu();
			this.make();
		};
		this.make = function () {
			switch (this.state) {
				case 0:
					this.createMenu([new StartControl()],'start');
					break;
				case 1:
					this.createMenu([new Frame1(), new Frame2(), new Frame3(), new RemoveControl()],'frame');
					break;
				case 2:
					this.createMenu([new PrevControl(), new Wiel1_voor(fiets), new Wiel2_voor(fiets), new Wiel3_voor(fiets), new RemoveControl()],'wiel');
					break;
				case 3:
					this.createMenu([new PrevControl(), new Stuur1(fiets), new Stuur2(fiets), new Stuur3(fiets), new RemoveControl()],'stuur');
					break;
				case 4:
					this.createMenu([new PrevControl(), new Zadel1(fiets), new Zadel2(fiets), new Zadel3(fiets), new RemoveControl()],'zadel');
					break;
				case 5:
					this.createMenu([new PrevControl(), new CheckoutControl()]);
					break;
				default:
					this.createMenu([]);
					break;
			}
		};
		this.needsNextControl = function(type){
			switch(type){
				case 'frame':
					return (!(fiets.getFrame() == null));
					break;
				case 'wiel':
					return (!(fiets.getWiel_v() == null));
					break;
				case 'stuur':
					return (!(fiets.getStuur() == null));
					break;
				case 'zadel':
					return (!(fiets.getZadel() == null));
					break;
				default:
					return false;
					break;
			}
		};
		this.createMenu = function (arr, type) {
			var iter = 0;
			var begin = Math.floor(arr.length / 2) * -1;
			if(this.needsNextControl(type)){
				arr.push(new NextControl());
			}
			for(i = 0; i < arr.length; i++){
				if(arr[i] instanceof Control){
					$(this.menu_holder).append(arr[i].makeControl(begin*4));
					var curr = document.getElementById(arr[i].getId());
					this.menuIds.push(arr[i].getId());
					jQuery.data(curr, 'f_type', arr[i]);
					curr.addEventListener('click', function () {
						jQuery.data(this,'f_type').execute();
					});
					begin++;
				} else {
					var id = 'fiets_el'+iter;
					$(this.menu_holder).append('<a-entity selectable id="'+id+'" geometry="primitive:plane; width:3; height:3;" material="src:#'+type+iter+'_img" position="' + begin*4 + ' 0 0"></a-entity>');
					this.menuIds.push(id);
					var currFiets = document.getElementById('fiets_el'+iter);
					jQuery.data(currFiets, 'f_type', arr[i]);
					currFiets.addEventListener('click', function () {
						if(!camera.hasObject()){
							var obj = jQuery.data(this, 'f_type');
							camera.setObj(obj);
							placer.makePlaces(obj.getType());
						}
					});
					begin++;
					iter++;
				}
			}

			// var iter = 0;
			// for(var i = begin*-1; i <= begin; i++){
			// 	iter++;
			// 	// $(this.menu_holder).append('<a-entity id="'+'fiets_el'+iter+'" geometry="primitive:plane; width:3; height:3;" material="src:#fiets_img" position="' + i*4 + ' 0 0"></a-entity>');
			// }

		}


	}
	var menu = new Menu();
	menu.make();

	function Placer() {
		this.state = '';

		this.makePlaces = function (state) {
			this.state = state;
			var fiets_holder = document.getElementById('fiets_holder');
			switch(this.state){
				case "frame":
					$(fiets_holder).append('<a-entity id="frame_pointer" class="pointer" mixin="pointer"></a-entity>');
					var currPointer = document.getElementById('frame_pointer');
					currPointer.addEventListener('mouseenter', function () {
						fiets.setFrame(camera.getObj());
						camera.removeObject();
						placer.removePlaces('frame_pointer');
						menu.nextMenu();
						placer.state++;
					});
					break;
				case "wiel":
					var WielPos = AFRAME.utils.coordinates.stringify(fiets.getFrame().getWiel_v_pos());
					$(fiets_holder).append('<a-entity id="wiel_v_pointer" class="pointer" mixin="pointer" position="'+WielPos+'"></a-entity>');
					WielPos = AFRAME.utils.coordinates.stringify(fiets.getFrame().getWiel_a_pos());
					$(fiets_holder).append('<a-entity id="wiel_a_pointer" class="pointer" mixin="pointer" position="'+WielPos+'"></a-entity>');
					var currPointer_v = document.getElementById('wiel_v_pointer');
					var currPointer_a = document.getElementById('wiel_a_pointer');
					var arr = [currPointer_v, currPointer_a];
					for(x = 0; x < arr.length; x++){
						arr[x].addEventListener('mouseenter', function () {
							fiets.setWiel_v(camera.getObj());
							fiets.setWiel_a(camera.getObj().getWiel_a());
							camera.removeObject();
							placer.removePlaces('wiel_v_pointer');
							placer.removePlaces('wiel_a_pointer');
							menu.nextMenu();
							placer.state++;
						});
					}
					break;
				case "stuur":
					var stuurPos = AFRAME.utils.coordinates.stringify(fiets.getFrame().getStuur_pos());
					$(fiets_holder).append('<a-entity id="stuur_pointer" class="pointer" mixin="pointer" position="'+stuurPos+'"></a-entity>');
					var stuurPointer = document.getElementById('stuur_pointer');
					stuurPointer.addEventListener('mouseenter', function () {
						fiets.setStuur(camera.getObj());
						camera.removeObject();
						placer.removePlaces('stuur_pointer');
						menu.nextMenu();
						placer.state++;
					});
					break;
				case "zadel":
					var zadelPos = AFRAME.utils.coordinates.stringify(fiets.getFrame().getZadel_pos());
					$(fiets_holder).append('<a-entity id="zadel_pointer" class="pointer" mixin="pointer" position="'+zadelPos+'"></a-entity>');
					var zadelPointer = document.getElementById('zadel_pointer');
					zadelPointer.addEventListener('mouseenter', function () {
						fiets.setZadel(camera.getObj());
						camera.removeObject();
						placer.removePlaces('zadel_pointer');
						menu.nextMenu();
						placer.state++;
					});
					break;
			}

		};
		this.removePlaces = function (pointer) {
			if(pointer){
				var removeable = document.getElementById(pointer);
				$(removeable).remove();
			} else {
				var anonRemovable = document.getElementsByClassName('pointer');
				$(anonRemovable).remove();
			}

		};
	}
	var placer = new Placer();

	function Frame1() {
		this.wiel_v_pos = {x:-2.59, y:1.39, z:0.12};
		this.wiel_a_pos = {x:1.77, y:1.39, z:0.12};
		this.wiel_scl = {x:1.8, y:1.8, z:1.8};

		this.stuur_pos = {x:-1.54 ,y:3.73 ,z:0 };
			// {x:-1.52, y:5.75, z:0.12};
		this.stuur_scl = {x:1, y:1, z:1};

		this.zadel_pos = {x:0.77, y:3.55, z:0};
		this.zadel_scl = {x:1, y:1, z:1};

		this.type = "frame";
		this.model = "#fiets1_obj";
		this.scale = {x:1.8, y:1.8, z:1.8};
		this.position = {x:0, y:0, z:0};

		this.prijs = 150.00;
		this.beschrijving = "Stads frame";

		this.getWiel_v_pos = function () {
			return this.wiel_v_pos;
		};
		this.getWiel_a_pos = function () {
			return this.wiel_a_pos;
		};
		this.getWiel_scl = function () {
			return this.wiel_scl;
		};
		this.getStuur_pos = function () {
			return this.stuur_pos;
		};
		this.getStuur_scl = function () {
			return this.stuur_scl;
		};
		this.getZadel_pos = function () {
			return this.zadel_pos;
		};
		this.getZadel_scl = function () {
			return this.zadel_scl;
		};

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model;
		};
		this.getScale = function () {
			return this.scale;
		};
		this.getPosition = function () {
			return this.position;
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Frame2() {
		this.wiel_v_pos = {x:-2.66, y:0.96, z:0.12};
		this.wiel_a_pos = {x:1.66, y:0.96, z:0.12};
		this.wiel_scl = {x:1.7, y:1.7, z:1.7};

		this.stuur_pos = {x:-1.87 ,y:3.12 ,z:0.05 };
			// {x:-1.85, y:5.34, z:0.12};
		this.stuur_scl = {x:1.5, y:1.5, z:1.5};

		this.zadel_pos = {x:0.45, y:3.1, z:0.06};
		this.zadel_scl = {x:1, y:1, z:1};

		this.type = "frame";
		this.model = "#fiets2_obj";
		this.scale = {x:2.6, y:2.6, z:2.6};
		this.position = {x:-0.49, y:0, z:0.12};

		this.prijs = 350.00;
		this.beschrijving = "Racefiets frame";

		this.getWiel_v_pos = function () {
			return this.wiel_v_pos;
		};
		this.getWiel_a_pos = function () {
			return this.wiel_a_pos;
		};
		this.getWiel_scl = function () {
			return this.wiel_scl;
		};
		this.getStuur_pos = function () {
			return this.stuur_pos;
		};
		this.getStuur_scl = function () {
			return this.stuur_scl;
		};
		this.getZadel_pos = function () {
			return this.zadel_pos;
		};
		this.getZadel_scl = function () {
			return this.zadel_scl;
		};

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model;
		};
		this.getScale = function () {
			return this.scale;
		};
		this.getPosition = function () {
			return this.position;
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Frame3() {
		this.wiel_v_pos = {x:-2.65, y:1.39, z:0.12};
		this.wiel_a_pos = {x:1.28, y:1.21, z:0.12};
		this.wiel_scl = {x:1.6, y:1.6, z:1.6};

		this.stuur_pos = {x:-1.87 ,y:3.80 ,z:0.02 };
			// {x:-1.78, y:5.73, z:0.19};
		this.stuur_scl = {x:1.45, y:1.45, z:1.45};

		this.zadel_pos = {x:0.56, y:3.56, z:0.02};
		this.zadel_scl = {x:1.15, y:1.15, z:1.15};

		this.type = "frame";
		this.model = "#fiets3_obj";
		this.scale = {x:1.7, y:1.7, z:1.7};
		this.position = {x:-0.74, y:0.59, z:0};

		this.prijs = 450.00;
		this.beschrijving = "True Reality Frame | Limited Edition";

		this.getWiel_v_pos = function () {
			return this.wiel_v_pos;
		};
		this.getWiel_a_pos = function () {
			return this.wiel_a_pos;
		};
		this.getWiel_scl = function () {
			return this.wiel_scl;
		};
		this.getStuur_pos = function () {
			return this.stuur_pos;
		};
		this.getStuur_scl = function () {
			return this.stuur_scl;
		};
		this.getZadel_pos = function () {
			return this.zadel_pos;
		};
		this.getZadel_scl = function () {
			return this.zadel_scl;
		};

			this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model;
		};
		this.getScale = function () {
			return this.scale;
		};
		this.getPosition = function () {
			return this.position;
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Wiel1() {
		this.type = "wiel";
		this.model = "#wiel1_obj";
		this.scale = {x:0.9, y:0.9, z:0.9};
		this.position = {x:0, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};

		this.prijs = 90.00;
		this.beschrijving = "Standaard velg";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Wiel1_voor(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_v_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};
		this.getWiel_a = function () {
			return new Wiel1_achter(fiets);
		}
	}
	Wiel1_voor.prototype = new Wiel1();

	function Wiel1_achter(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_a_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		}
	}
	Wiel1_achter.prototype = new Wiel1();

	function Wiel2() {
		this.type = "wiel";
		this.model = "#wiel2_obj";
		this.scale = {x:1.1, y:1.1, z:1.1};
		this.position = {x:0, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};

		this.prijs = 130.00;
		this.beschrijving = "Dubbele velg met crossband";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Wiel2_voor(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_v_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};
		this.getWiel_a = function () {
			return new Wiel2_achter(fiets);
		}
	}
	Wiel2_voor.prototype = new Wiel2();

	function Wiel2_achter(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_a_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		}
	}
	Wiel2_achter.prototype = new Wiel2();

	function Wiel3() {
		this.type = "wiel";
		this.model = "#wiel3_obj";
		this.scale = {x:0.8, y:0.8, z:0.8};
		this.position = {x:0, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};

		this.prijs = 110.00;
		this.beschrijving = "Sportvelg met sportband";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Wiel3_voor(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_v_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};
		this.getWiel_a = function () {
			return new Wiel1_achter(fiets);
		}
	}
	Wiel3_voor.prototype = new Wiel3();

	function Wiel3_achter(refObj) {
		this.getScale = function () {
			var ref = refObj.getFrame().getWiel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getWiel_a_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		}
	}
	Wiel3_achter.prototype = new Wiel3();

	function Stuur1(refObj) {
		this.type = "stuur";
		this.model = "#stuur1_obj";
		this.scale = {x:1, y:1, z:1};
		this.position = {x:0.10, y:0, z:0};
		this.rotation = {x:0, y:0, z:0};

		this.prijs = 60.00;
		this.beschrijving = "Gebogen stuur met verlichting";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getStuur_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getStuur_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Stuur2(refObj) {
		this.type = "stuur";
		this.model = "#stuur2_obj";
		this.scale = {x:2, y:2, z:2};
		this.position = {x:-0.19, y:0.15, z:0.04};
		this.rotation = {x:0, y:0, z:0};

		this.prijs = 70.00;
		this.beschrijving = "Recht sportstuur";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getStuur_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getStuur_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Stuur3(refObj) {
		this.type = "stuur";
		this.model = "#stuur3_obj";
		this.scale = {x:1.2, y:1.2, z:1.2};
		this.position = {x:0, y:0.02, z:0.05};

		this.prijs = 60.00;
		this.beschrijving = "Recht stuur zonder extensie";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getStuur_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getStuur_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Zadel1(refObj) {
		this.type = "zadel";
		this.model = "#zadel1_obj";
		this.scale = {x:1.3, y:1.3, z:1.3};
		this.position = {x:0.02, y:0, z:0};

		this.prijs = 45.00;
		this.beschrijving = "Lederen zadel";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getZadel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getZadel_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Zadel2(refObj) {
		this.type = "zadel";
		this.model = "#zadel2_obj";
		this.scale = {x:1.5, y:1.5, z:1.5};
		this.position = {x:0, y:0, z:0};

		this.prijs = 20.00;
		this.beschrijving = "Standaard zadel";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getZadel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getZadel_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	function Zadel3(refObj) {
		this.type = "zadel";
		this.model = "#zadel3_obj";
		this.scale = {x:1.35, y:1.35, z:1.35};
		this.position = {x:-0.05, y:0, z:0};

		this.prijs = 35.00;
		this.beschrijving = "Sportzadel";

		this.getType = function () {
			return this.type;
		};
		this.getModel = function () {
			return this.model
		};
		this.getScale = function () {
			var ref = refObj.getFrame().getZadel_scl();
			return {x:this.scale.x * ref.x, y:this.scale.y * ref.y, z:this.scale.z * ref.z};
		};
		this.getPosition = function () {
			var ref = refObj.getFrame().getZadel_pos();
			return {x:this.position.x + ref.x, y:this.position.y + ref.y, z:this.position.z + ref.z};
		};

		this.getPrijs = function () {
			return this.prijs;
		};
		this.getBeschrijving = function () {
			return this.beschrijving;
		};
	}

	// vult het model in het dom in
	function create(obj, id) {
		var entity = document.getElementById(id);
		entity.setAttribute("collada-model", obj.getModel());
		entity.setAttribute("scale", obj.getScale());
		entity.setAttribute("position", obj.getPosition());
	}



	// fiets.setFrame(new Frame2(fiets));
	// fiets.setStuur(new Stuur2(fiets));
	// fiets.setWiel_v(new Wiel2_voor(fiets));
	// fiets.setWiel_a(new Wiel2_achter(fiets));
	// fiets.setZadel(new Zadel1(fiets));

	AFRAME.registerComponent('selectable', {
		init: function () {
			this.el.addEventListener('mouseenter', function () {
				var cam = document.getElementById('camera');
				$(cam).append('<a-box id="timer" depth="0.1" width="0" height="0.2" color="grey" position="0 0.3 -5"></a-box>');
				var timer = document.getElementById('timer');
				$(timer).append('<a-animation attribute="width" dur="1500" fill="forwards" to="3" repeat="0"></a-animation>');
			});
			this.el.addEventListener('mouseleave', function () {

				var timer = document.getElementById('timer');
				$(timer).remove();
			});
			this.el.addEventListener('click', function () {
				var timer = document.getElementById('timer');
				$(timer).remove();
			});
		}
	});

});