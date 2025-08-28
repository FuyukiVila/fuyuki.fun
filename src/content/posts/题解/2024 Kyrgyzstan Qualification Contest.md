---
title: 2024-2025 ICPC NERC, Kyrgyzstan Qualification Contest
published: 2024-12-27
description: "2024 Kyrgyzstan Qualification Contest 题解报告"
image: ""
tags: [codeforces, ICPC, NERC]
category: "题解"
draft: false
lang: ""
---

## 题目链接

**[2024-2025 ICPC NERC, Kyrgyzstan Qualification Contest](https://codeforces.com/gym/105494)**

## [A. Problem Statement](https://codeforces.com/gym/105494/problem/A)

### 题意

给 $n$ 行字符串，问输入了几个回车

### 题解

输出 $n-1$

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n;
    cin >> n;
    cout << n - 1 << '\n';
}
```

## [B. Ant Hill](https://codeforces.com/gym/105494/problem/B)

### 题意

给定 $n$ 个数表示蚂蚁山中，蚂蚁的进出，蚂蚁山在任何时刻蚂蚁的数量都不为负数，求最开始至少有几只蚂蚁

### 题解

从头开始模拟蚂蚁的进出，设 $res$ 为当前蚂蚁山的数量，$ans = -\min\{res | res \leq 0\}$

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n;
    cin >> n;
    ll ans = 0;
    ll p = 0;
    for(int i = 1;i <= n; i++){
        ll x;
        cin >> x;
        p += x;
        if(p <= 0) ans = max(ans, -p);
    }
    cout << ans << '\n';
}
```

## [C. Linear Maze](https://codeforces.com/gym/105494/problem/C)

### 题意

$n$ 个房间，每次可以从房间 $n$ 转移到房间 $n + 1$，有 $k$ 个特殊房间，如果在奇数次访问这样一个房间，**下一步**则会传送到房间 $1$，问离开迷宫要经过几个房间

### 题解

当访问到普通房间时，步数 + 1，如果访问到特殊房间，则步数 + 1后翻倍，显然访问到特殊房间后，回到该房间需要重新走相同的路程

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n, k;
    cin >> n >> k;
    vector<int> a(n + 1);
    for(int i = 1;i <= k; i ++){
        int x;
        cin >> x;
        a[x] = 1;
    }
    ll ans = 0;
    for(int i = 1;i <= n; i++){
        ans ++;
        if(a[i]) ans *= 2;
    }
    cout << ans << '\n';
}
```

## [D. Grouping](https://codeforces.com/gym/105494/problem/D)

### 题意

将 $n$ 个数字分为最小数目的好数集，好数集的定义如下：

1.  集合的大小不超过 $k$

2.  集合的最大值和最小值之差不超过 $M$

### 题解

排序原数组，贪心地将其放入当前集合中，若满足则放入，否则另开一个新集合

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n, m, k;
    cin >> n >> m >> k;
    vector<ll> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());
    ll num = -INF;
    int cnt = m;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        if (cnt == k) {
            cnt = 1;
            num = a[i];
            ans++;
        } else if (a[i] - num > m) {
            cnt = 1;
            num = a[i];
            ans++;
        } else {
            cnt++;
        }
    }
    cout << ans << endl;
}
```

## [H. Hierarchy](https://codeforces.com/gym/105494/problem/H)

### 题意

给定几个公司的员工架构树，求员工数量最多的一个公司

### 题解

DFS求每个树的大小即可

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n;
    cin >> n;
    vector<vector<int> > son(n + 1);
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        son[x].push_back(i);
    }
    vector<int> dp(n + 1, 0);
    int ans = 0;
    int maxn = 0;
    function<void(int)> dfs = [&](int u) {
        if (son[u].empty()) {
            dp[u] = 1;
            return;
        }
        for (auto v : son[u]) {
            dfs(v);
            dp[u] += dp[v];
            if (u == 0 && dp[v] > maxn) {
                maxn = dp[v];
                ans = v;
            }
        }
        dp[u] += 1;
    };
    dfs(0);
    cout << ans << ' ' << maxn << endl;
}
```

## [I. Study Day](https://codeforces.com/gym/105494/problem/I)

### 题意

参加 $n$ 次讲座，每次可以获得 $a_i$ 点知识点，可以在参加前进行冥想使得这次获得的知识点翻倍，不能连续冥想两次，问知识点最多为多少？

### 题解

令 $dp_m(i)$ 表示第 $i$ 次未冥想获得的最多知识点，$dp_o(i)$ 表示第 $i$ 次冥想获得的最多的知识点，那么满足：

$$
dp_m(i) = \max(dp_o(i - 1), dp_m(i - 1)) + a_i \\
dp_o(i) = dp_m(i-1) + 2 \times a_i
$$

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n;
    cin >> n;
    vector<vector<ll> > dp(2, vector<ll>(n + 1));
    vector<string> ans(2);
    for (int i = 1; i <= n; i++) {
        ll x;
        cin >> x;
        auto tmp = ans;
        if (dp[0][i - 1] > dp[1][i - 1]) {
            dp[0][i] = dp[0][i - 1] + x;
            ans[0] = tmp[0] + 'O';
        } else {
            dp[0][i] = dp[1][i - 1] + x;
            ans[0] = tmp[1] + 'O';
        }
        dp[1][i] = dp[0][i - 1] + 2 * x;
        ans[1] = tmp[0] + 'M';
    }
    if (dp[0][n] > dp[1][n]) {
        cout << dp[0][n] << endl;
        cout << ans[0] << endl;
    } else {
        cout << dp[1][n] << endl;
        cout << ans[1] << endl;
    }
}
```

## [F. Traffic Lights](https://codeforces.com/gym/105494/problem/F)

### 题意

有 $n$ 个路口，到达一个路口花费 $a_i$，路口处红灯亮 $r_i$ 秒，绿灯亮 $g_i$ 秒，一开始红灯亮了 $d_i$ 秒，求通过所有路口花费的总时间

### 题解

令 $time$ 为到达路口时花费的总时间，那么该路口的灯已经亮了 $time + d_i$ 秒，显然路口的灯以 $r_i + g_i$ 为周期循环，令 $rem = (time + d_i) \mod (r_i + g_i)$ ，当 $rem < g_i$ 时，为绿灯，直接通过，当 $rem > r_i$ 时为红灯，$time := time + r_i + g_i - rem$

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n;
    cin >> n;
    vector<int> a(n + 1), r(n + 1), g(n + 1), d(n + 1);
    for(int i = 1; i <= n; i++){
        cin >> a[i];
    }
    for(int i = 1; i <= n; i++){
        cin >> r[i] >> g[i] >> d[i];
    }
    ll time = 0;
    for(int i = 1;i <= n; i++){
        time += a[i];
        ll t = time + d[i];
        ll rem = t % (r[i] + g[i]);
        if(rem < g[i]){
            continue;
        }
        else{
            time += r[i] + g[i] - rem;
        }
    }
    cout << time << endl;
}
```

## [G. Need More Gold](https://codeforces.com/gym/105494/problem/G)

### 题意

有 $n$ 个怪物，每个怪物打败需要 $b_i$ 个金币（不花费），打败后获得 $g_i$ 个金币，求积累 $w$ 个金币最少打败怪物的数量和顺序

### 题解

维护优先队列，每一次选择当前可打败的价值最高的怪物。

### 代码

```cpp
struct node {
    int id;
    ll x, y;
    bool operator<(const node &rhs) const { return x < rhs.x; }
};
void idol_produce(int testCase) {
    /*Code Here*/
    ll w, n;
    cin >> w >> n;
    vector<node> a(n + 1);
    for (int i = 0; i < n; i++) {
        cin >> a[i].x >> a[i].y;
        a[i].id = i + 1;
    }
    sort(a.begin(), a.end(), [](node a, node b) { return a.y > b.y; });
    priority_queue<node> q;
    vector<int> ans;
    ll now = 0;
    while (!a.empty() && a.back().y == 0) {
        q.push(a.back());
        a.pop_back();
    }
    while (!q.empty() && now < w) {
        node t = q.top();
        q.pop();
        now += t.x;
        ans.emplace_back(t.id);
        while (!a.empty() && a.back().y <= now) {
            q.push(a.back());
            a.pop_back();
        }
    }
    if (now < w) {
        cout << -1 << endl;
        return;
    }
    cout << ans.size() << endl;
    for (auto i : ans) {
        cout << i << " ";
    }
}
```

## [E. Mountain Ranges](https://codeforces.com/gym/105494/problem/E)

### 题意

$n$ 座山，假如相邻两座山之间的高度差不大于 $k$，则视为同一座山脉，问最小的 $k$ 使得恰好划分为 $m$ 座山脉

### 题解

二分 $k$，当 $ans > m$ 时，$k$ 向上二分，否则向上二分

### 代码

```cpp
void idol_produce(int testCase) {
    /*Code Here*/
    int n, m;
    cin >> n >> m;
    vector<int> a(n + 1);
    for(int i = 1;i <= n; i++){
        cin >> a[i];
    }
    if(n == 1){
        cout << 1 << '\n';
        return;
    }
    int l = 1, r = 1e6;
    int ans = -1;
    while(l <= r){
        int mid = (l + r) >> 1;
        int cnt = 1;
        for(int i = 2;i <= n; i++){
            if(abs(a[i] - a[i - 1]) > mid){
                cnt++;
            }
        }
        if(cnt > m){
            l = mid + 1;
        }
        else if(cnt == m){
            ans = mid;
            r = mid - 1;
        }
        else{
            r = mid - 1;
        }
    }
    cout << ans << endl;
}
```
