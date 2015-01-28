//todo: renderInto inherited from component, breaks webcomponent prototype

define(['./component', 'ichimon/main', 'yobidashi/main'], function (component, mixins, messages) {

	var webcomponent = mixins.mix(HTMLElement.prototype, component);

	//define a web component, it will mixin from component
	var extend = {
		//generate the innerHTML for this component, and then append it to the root of this
		//rendered HTML node
		render: function() {
			this.innerHTML = this.generateInnerHTML();
		},
		//we'll be extended component.create
		//the inherited function is passed in as the first param
		create: function (sup) {

			if (!this.tag) {
				throw "need .tag property when using mixin webcomponent"
			};
			var _this = this;

			this.instance = document.registerElement(
				this.tag, {
					prototype: Object.create(
						_this, {
							createdCallback: {
								value: function () {
									//run inherited create
									sup.apply(this, arguments);
									//fill the node with it's template
									if(!_this.defer) {
										this.innerHTML += _this.generateInnerHTML();
									}

									if (this.created && typeof this.created == 'function') {
										this.created();
									}
									//putting this on the backburner for now
									//messages.pub(this.channel + '/rendered');
								}
							},

							//other call backs that need to be attached somewhere
							//todo add to messaging
							attachedCallback: {
								value: function () {
									if (this.attached && typeof this.attached == 'function') {
										this.attached();
									}
								}
							},
							detachedCallback: {
								value: function () {
									if (this.detached && typeof this.detached == 'function') {
										this.detached();
									}
								}
							},
							attributeChangedCallback: {
								value: function (
									name, previousValue, value
								) {
									//todo finish implimentation of attributes changed
									if (previousValue == null) {
//										console.log(
//											'got a new attribute ', name,
//											' with value ', value
//										);
									} else if (value == null) {
//										console.log(
//											'somebody removed ', name,
//											' its value was ', previousValue
//										);
									} else {
//										console.log(
//											name,
//											' changed from ', previousValue,
//											' to ', value
//										);
									}
								}
							}
						})
				}
			);
		}
	};

	webcomponent = mixins.mix(webcomponent, extend);
	return webcomponent;
});