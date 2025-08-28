---
title: ArchWsl的一些注意事项和技巧
published: 2024-12-19
description: "ArchWsl的一些注意事项和技巧"
image: ""
tags: [WSL, Arch, wslg]
category: "Linux"
draft: false
lang: ""
---

#### font

##### 将windows字体共享到wsl中

```shell
sudo ln -s /mnt/c/Windows/Fonts /usr/share/fonts/windows
sudo fc-cache -fv
```

##### 切换默认字符集为zh_CN.UTF-8

```shell
sudo vim /etc/locale.gen
```

删掉文件中 `# zh_CN.UTF-8` 前的 `#`

##### 下载语言包

```shell
sudo locale-gen
```

##### 在`.zshrc`或`.bashrc`前加入

```shell
export LANG=zh_CN.UTF-8
export LANGUAGE=zh_CN:en_US
```

##### 重启wsl

```shell
wsl --shutdown
```

#### wslg修复

##### 修复X11

```shell
sudo rm -r /tmp/.X11-unix
ln -s /mnt/wslg/.X11-unix /tmp/.X11-unix
```

##### 修复wayland

```shell
ln -sf /mnt/wslg/runtime-dir/wayland-0* /run/user/1000/
```

#### 中文输入法

##### 安装fcitx5

```shell
sudo pacman -S fcitx5-im fcitx5-chinese-addons
```

##### 在`.zshrc`或`.bashrc`前加入

```shell
export QT_IM_MODULE=fcitx
export GTK_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export SDL_IM_MODULE=fcitx
export GLFW_IM_MODULE=ibus
```

##### 创建dbus的用户进程

```shell
sudo loginctl enable-linger $USER
```

##### 禁用wayland

```shell
# 在配置文件 /home/$USER/.config/fcitx5/config 后面追加 以下内容
[Behavior/DisabledAddons]
0=wayland
```

##### 启动fcitx5

```shell
fcitx5&
```

##### 加入拼音输入

```shell
fcitx5-configtool
```

将`简体中文（中国）` > `Pinyin` 加入左侧

#### 清理空间

##### 清理安装包缓存

```shell
sudo pacman -Scc
```

##### 清理孤立的软件包

```shell
sudo pacman -Rns $(pacman -Qtdq)
```

##### 清理日志

```shell
sudo journalctl --vacuum-size=50M
```
