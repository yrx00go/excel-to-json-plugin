{ pkgs }: {
	deps = [
		pkgs.nodejs-16_x
		pkgs.npm
		pkgs.replitPackages.jest
	];
}