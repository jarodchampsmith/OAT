import SignaturePad from 'signature_pad';
import { Toast } from 'quasar';

import { mfForm } from '../../mixins';

export default {
	mixins: [
		mfForm
	],
	data () {
		return {
			answerFormat: 'png',
			answerType: 'image',
			signatureCanvas: null,
			signaturePad: null,
			selectedSignature: null
		};
	},
	name: 'mf-signature',
	created: function() {
		if (!this.value.answer.signatures) {
			this.value.answer.signatures = [
				{
					userid: this.$store.getters.currentUser.ID,
					signature: null
				}
			]
		}
		this.selectedSignature = this.value.answer.signatures[0];
		this.$set(this.value.answer, 'signatures', this.value.answer.signatures);
	},
	computed: {
		currentSignatures: function () {
			if (this.value.answer.signatures) {
				return this.value.answer.signatures
			}

			return [];
		},
	},
	methods: {
		addSignature: function (signature) {

			if (this.numPhotos < 3) {
				Toast.create.negative("You must add at least 3 photos before you can sign off on this inspection.")
				return;
			}

			this.$refs.signatureModal.open();
			this.selectedSignature = signature;
		},
		removeSignature: function(index) {
			if (index === 0 && this.value.answer.signatures && this.value.answer.signatures.length === 1) {
				Toast.create.negative('You can not remove the primary signature.');
				return;
			}
			if (this.value.answer.signatures) {
				this.value.answer.signatures.splice(index, 1);
			}
			this.$set(this.value.answer, 'signatures', this.value.answer.signatures);
			this.$forceUpdate();
		},
		addNewSignature: function() {
			if (this.value.answer.signatures) {
				this.value.answer.signatures.push({
					userid : this.$store.getters.currentUser.ID,
					signature : null
				});
			} else {
				this.value.answer.signatures = [
					{
						userid: this.$store.getters.currentUser.ID,
						signature: null
					}
				]
			}

			this.$set(this.value.answer, 'signatures', this.value.answer.signatures);
			this.$forceUpdate();

		},
		setupSignature: function () {
			const wrapper = document.querySelectorAll('.signature-panel');
			const canvases = document.querySelectorAll('.signature-canvas');

			if (canvases && canvases.length > 0) {
				for (var i = 0; i < canvases.length; i++) {
					canvases[i].parentNode.removeChild(canvases[i]);
				}
			}

			this.$set(this, 'signatureCanvas', document.createElement('canvas'));
			this.signatureCanvas.width = 800;
			this.signatureCanvas.height = 250;
			this.signatureCanvas.classList.add('signature-canvas');
			this.signatureCanvas.classList.add('full-width');
			wrapper[wrapper.length - 1].appendChild(this.signatureCanvas); // Only the last one in the DOM is visible
			this.resizeCanvas();
			this.$set(this, 'signaturePad', new SignaturePad(this.signatureCanvas));
			if (this.selectedSignature.signature) {
				this.signaturePad.fromDataURL(this.selectedSignature.signature);
			}
		},
		resizeCanvas: function () {
			const ratio = Math.max(window.devicePixelRatio || 1, 1);
			const offsetWidth = this.signatureCanvas.offsetWidth;
			const offsetHeight = this.signatureCanvas.offsetHeight;
			this.signatureCanvas.width = offsetWidth * ratio;
			this.signatureCanvas.height = offsetHeight * ratio;
			this.signatureCanvas.getContext('2d').scale(ratio, ratio);
		},
		clearSignature: function () {
			this.signaturePad.clear();
		},
		resetSignature: function () {
			this.signaturePad.clear();
			if (this.selectedSignature.signature) {
				this.signaturePad.fromDataURL(this.selectedSignature.signature);
			}
		},
		closePad: function () {
			if (this.signaturePad.isEmpty()) {
				this.$set(this.selectedSignature, 'signature', null);
			} else {
				this.$set(this.selectedSignature, 'signature', this.signaturePad.toDataURL());
			}
			this.signaturePad.off();
			this.update();
			this.$refs.signatureModal.close();
		}
	}
};
