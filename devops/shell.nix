 let
   nixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/tarball/nixos-22.11";
   pkgs = import nixpkgs { config = {}; overlays = []; };
 in

 pkgs.mkShell {
   packages = with pkgs; [
     git
     neovim
     nodejs
   ];

   GIT_EDITOR = "${pkgs.neovim}/bin/nvim";

  shellHook = ''
    git status
  '';
}
