---
title: XCPC板子
published: 2025-12-16
description: ""
image: "./yuri.jpg"
tags: [codeforces, ICPC]
category: "XCPC"
draft: false
lang: ""
top: true
---

## 线性结构

### KMP

```cpp
class KMP2 {
private:
    std::vector<std::vector<int>> dp;
    std::string pat;

public:
    KMP2(std::string pat) : pat(pat) {
        // dp[状态][字符] = 下个状态
        dp = std::vector<std::vector<int>>(pat.length(), std::vector<int>(256, 0));
        // base case
        dp[0][pat[0]] = 1;
        // 影子状态 X 初始为 0
        int X = 0;
        // 构建状态转移图
        for (size_t j = 1; j < pat.length(); j++) {
            for (size_t c = 0; c < 256; c++)
                dp[j][c] = dp[X][c];
            dp[j][pat[j]] = j + 1;
            // 更新影子状态
            X = dp[X][pat[j]];
        }
    }

    int search(std::string txt, size_t pos = 0) {
        // pat 的初始态为 0
        int j = 0;
        for (size_t i = pos; i < txt.length(); i++) {
            // 计算 pat 的下一个状态
            j = dp[j][txt[i]];
            // 到达终止态，返回结果
            if (j == pat.length()) return i - pat.length() + 1;
        }
        // 没到达终止态，匹配失败
        return -1;
    };
};

class KMP {
    std::string pattern;
    vector<int> next;

    void buildNext() {
        for (int i = 1, j = 0; i < pattern.size(); i++) {
            while (j && pattern[i] != pattern[j]) j = next[j - 1];
            if (pattern[i] == pattern[j]) j++;
            next[i] = j;
        }
    }

public:
    auto searchAll(std::string txt) {
        std::vector<size_t> p;
        for (size_t i = 0, j = 0; i < txt.size(); i++) {
            while (j && txt[i] != pattern[j]) j = next[j - 1];
            if (txt[i] == pattern[j]) j++;
            if (j == pattern.size()) {
                p.emplace_back(i - pattern.size() + 1);
                j = next[j - 1];
            }
        }
        return p;
    }

    size_t search(std::string txt, size_t pos = 0) {
        for (size_t i = pos, j = 0; i < txt.size(); i++) {
            while (j && txt[i] != pattern[j]) j = next[j - 1];
            if (txt[i] == pattern[j]) j++;
            if (j == pattern.size()) {
                return i - pattern.size() + 1;
            }
        }
        return -1;
    }

    KMP(std::string pattern) : pattern(pattern) {
        next.resize(pattern.size() + 1);
        buildNext();
    }
};
```

### Manacher 求回文串

```cpp
struct Manacher {

    // 求奇数回文串
    std::vector<int> static getOddPalindrome(const std::string &s) {
        std::vector<int> d1(s.size());
        for (int i = 0, l = 0, r = -1; i < s.size(); i++) {
            int k = (i > r) ? 1 : std::min(d1[l + r - i], r - i + 1);
            while (0 <= i - k && i + k < s.size() && s[i - k] == s[i + k]) {
                k++;
            }
            d1[i] = k--;
            if (i + k > r) {
                l = i - k;
                r = i + k;
            }
        }
        return d1;
    }

    // 求偶数回文串
    std::vector<int> static getEvenPalindrome(const std::string &s) {
        std::vector<int> d2(s.size());
        for (int i = 0, l = 0, r = -1; i < s.size(); i++) {
            int k = (i > r) ? 0 : std::min(d2[l + r - i + 1], r - i + 1);
            while (0 <= i - k - 1 && i + k < s.size() &&
                    s[i - k - 1] == s[i + k]) {
                k++;
            }
            d2[i] = k--;
            if (i + k > r) {
                l = i - k - 1;
                r = i + k;
            }
        }
        return d2;
    }
};
```

### 字符串哈希(1-based)

```cpp
template<size_t HashBase = 233>
class StringHash {
    std::vector<size_t> hash;
    std::vector<size_t> hashPow;

public:
    std::string str;

    explicit StringHash() = default;

    explicit StringHash(const std::string &str) :
            str(str),
            hash(std::vector<size_t>(str.size())),
            hashPow(std::vector<size_t>(str.size())) {
        hashPow[0] = 1;
        hash[0] = 0;
        for (size_t i = 1; i < str.size(); i++) {
            hash[i] = (hash[i - 1] * HashBase + str[i]);
            hashPow[i] = hashPow[i - 1] * HashBase;
        }
    }

    constexpr size_t getHash(size_t l, size_t r) const {
        assert(r >= l);
        assert(l > 0);
        assert(r < str.size());
        return hash[r] - hash[l - 1] * hashPow[r - l + 1];
    }

    int compare(size_t l1, size_t r1, size_t l2, size_t r2) const {
        assert(r1 >= l1 && r2 >= l2);
        assert(l1 > 0 && l2 > 0);
        assert(r1 < str.size() && r2 < str.size());
        size_t l = 0, r = std::min(r1 - l1, r2 - l2) + 1;
        size_t ans;
        while (l <= r) {
            size_t mid = (l + r) / 2;
            if (getHash(l1, l1 + mid - 1) == getHash(l2, l2 + mid - 1)) {
                l = mid + 1;
                ans = mid;
            } else {
                r = mid - 1;
            }
        }
        if (ans == std::min(r1 - l1, r2 - l2) + 1) {
            if (r1 - l1 == r2 - l2) {
                return 0;
            } else if (r1 - l1 > r2 - l2) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return (str[l1 + ans] > str[l2 + ans]) ? 1 : -1;
        }
    }
};
```

### 最小表示法

```cpp
int k = 0, i = 0, j = 1;
while (k < n && i < n && j < n) {
  if (sec[(i + k) % n] == sec[(j + k) % n]) {
    k++;
  } else {
    sec[(i + k) % n] > sec[(j + k) % n] ? i = i + k + 1 : j = j + k + 1;
    if (i == j) i++;
    k = 0;
  }
}
i = min(i, j);
```

### 后缀数组

- $sa[i]$ 表示将所有后缀排序后第 $i$ 小的后缀的编号

- $rank[i]$ 表示后缀 $i$ 的排名

- $height[i]$ 第 $i$ 名的后缀与它前一名的后缀的最长公共前缀

- $lcp(s[i], s[j]) = \min\{height[i+1...j]\}$

```cpp
class SuffixArray {
public:
    std::vector<size_t> sa;
    std::vector<size_t> rank;
    std::vector<size_t> height;
    explicit SuffixArray() = default;

    explicit SuffixArray(const std::string &str) :
            sa(std::vector<size_t>(str.size())),
            rank(std::vector<size_t>(str.size())),
            height(std::vector<size_t>(str.size())) {
        StringHash<233> sh = StringHash<233>(str);
        for (size_t i = 1; i < str.size(); i++) {
            sa[i] = i;
        }
        std::sort(sa.begin() + 1, sa.end(), [&](size_t a, size_t b) -> bool {
            return sh.compare(a, str.size() - 1, b, str.size() - 1) == -1;
        });
        for (size_t i = 1; i < str.size(); i++) {
            rank[sa[i]] = i;
        }
        for (size_t i = 1, k = 0; i < str.size(); i++) {
            if (rank[i] == 1) {
                k = 0;
            } else {
                if (k) {
                    k--;
                }
                while (str[i + k] == str[sa[rank[i] - 1] + k]) {
                    k++;
                }
            }
            height[rank[i]] = k;
        }
    }
};
```

### ST表

```cpp
#ifndef __SPARSE_TABLE_HPP
#define __SPARSE_TABLE_HPP

// SpareTable<ElemType, CompareType> ElemType: 元素类型 CompareType: 比较函数,
// 默认为greater<>
template <class T = long long, class Cmp = std::greater<T> >
struct SparseTable {
   private:
    std::vector<std::vector<T> > st;

   public:
    explicit SparseTable() = default;
    explicit SparseTable(const std::vector<T> &&a) {
        st.resize(a.size(), std::vector<T>(32));
        for (int i = 0; i < a.size(); i++) {
            st[i][0] = a[i];
        }
        for (int j = 1; 1 << j <= a.size(); j++) {
            for (int i = 0; i + (1 << j) - 1 < a.size(); i++) {
                st[i][j] = Cmp(st[i][j - 1], st[i + (1 << (j - 1))][j - 1])
                               ? st[i][j - 1]
                               : st[i + (1 << (j - 1))][j - 1];
            }
        }
    }

    T get(int l, int r) {
        assert(r >= l);
        assert(l >= 0);
        assert(r < st.size());
        int k = std::__lg(r - l + 1);
        return Cmp(st[l][k], st[r - (1 << k) + 1][k]) ? st[l][k]
                                                      : st[r - (1 << k) + 1][k];
    }
};

#endif
```

### AC自动机

```cpp
template<size_t base = 26>
class Automaton {
private:
    std::array<std::vector<int>, base> tr;
    std::vector<int> count;
    std::vector<int> fail;
    int tot = 0;
public:
    // MAXSIZE 模式串的总长
    Automaton(int maxsize) : count(maxsize), fail(maxsize) {
        for (int i = 0; i < base; ++i) tr[i].resize(maxsize);
    }

    void insert(const std::string &s, int id) {
        int u = 0;
        for (int i = 0; i < s.size(); i++) {
            int c = s[i] - 'a';
            if (!tr[c][u]) tr[c][u] = ++tot;
            u = tr[c][u];
        }
        count[u] = id;
    }

    void build() {
        std::queue<int> q;
        for (int i = 0; i < base; i++) if (tr[i][0]) q.push(tr[i][0]);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int i = 0; i < base; i++) {
                if (tr[i][u]) {
                    fail[tr[i][u]] = tr[i][fail[u]];
                    q.push(tr[i][u]);
                } else tr[i][u] = tr[i][fail[u]];
            }
        }
    }

    std::unordered_map<int, int> query(const std::string &t) {
        int u = 0;
        std::unordered_map<int, int> ans;
        for (int i = 0; i < t.size(); i++) {
            u = tr[t[i] - 'a'][u];
            for (int j = u; j; j = fail[j]) {
                if (count[j]) ans[count[j]]++;
            }
        }
        return ans;
    }
};
```

## 树状结构

### Trie树

```cpp
#ifndef __TRIE_HPP
#define __TRIE_HPP

template<class T = char>
class Trie {
private:
    typedef T element_type;

    struct TrieNode {
        size_t wordCount;
        std::map<element_type, std::unique_ptr<TrieNode> > next;

        TrieNode() : wordCount(0), next(std::map<element_type, std::unique_ptr<TrieNode> >()) {}

    };

    std::unique_ptr<TrieNode> _root;

public:

    explicit Trie() { _root = std::make_unique<TrieNode>(); }

    TrieNode* root() { return _root.get(); }

    void clear() { _root = std::make_unique<TrieNode>(); }

    TrieNode* insert(const std::basic_string<element_type> &word, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        for (char const &i: word) {
            if (location->next[i] == nullptr) {
                location->next[i] = std::make_unique<TrieNode>();
            }
            location = location->next[i].get();
        }
        location->wordCount++;
        return location;
    }

    TrieNode* insert(element_type character, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        if (location->next[character] == nullptr) {
            location->next[character] = std::make_unique<TrieNode>();
        }
        location = location->next[character].get();
        location->wordCount++;
        return location;
    }

    TrieNode* find(const std::basic_string<element_type> &word, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        for (int i = 0; i < word.length() && location; i++)
            location = location->next[word[i]].get();
        return location;
    }

    TrieNode* find(element_type character, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        return location->next[character].get();
    }

    size_t count(const std::basic_string<element_type> &word, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        for (int i = 0; i < word.length() && location; i++)
            location = location->next[word[i]].get();
        return location == nullptr ? 0 : location->wordCount;
    }

    size_t count(element_type character, TrieNode* pos = nullptr) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        return location->next[character] == nullptr ? 0 : location->next[character]->wordCount;
    }

    TrieNode* erase(const std::basic_string<element_type> &word, TrieNode* pos = nullptr, size_t count = 1) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        for (int i = 0; i < word.length() && location; i++)
            location = location->next[word[i]].get();
        if (location == nullptr) return nullptr;
        location->wordCount -= min(count, location->wordCount);
        return location;
    }

    TrieNode* erase(element_type character, TrieNode* pos = nullptr, size_t count = 1) {
        auto location = (pos == nullptr) ? _root.get() : pos;
        if (location->next[character] == nullptr) return nullptr;
        location->next[character]->wordCount -= min(count, location->next[character]->wordCount);
        return location;
    }

};

#endif
```

### 线段树

```cpp
template<class T = long long, class V = long long>
class ISegmentTree {
protected:
    typedef T element_type;
    typedef V value_type;

    struct node {
        value_type value;
        element_type add;
        element_type change;
        bool isChange{false};
        size_t id{0};
        size_t l{0}, r{0};

        constexpr bool inRange(int l, int r) {
            return this->l >= l && this->r <= r;
        }

        constexpr bool outOfRange(int l, int r) {
            return this->l > r || this->r < l;
        }

        constexpr size_t size() { return r - l + 1; }
    };

    constexpr static size_t ls(size_t x) { return 2 * x; }

    constexpr static size_t rs(size_t x) { return 2 * x + 1; }

    std::vector<node> tree;

    // you should modify these functions
    virtual value_type assign_value(const std::vector<element_type> &arr,
                                    size_t x) = 0;

    virtual value_type merge_value(value_type x, value_type y) = 0;

    virtual void add_value(size_t x, element_type add) = 0;

    virtual void change_value(size_t x, element_type change) = 0;

    void add_tag(size_t x, element_type add) {
        add_value(x, add);
        tree[x].add += add;
    }

    void change_tag(size_t x, element_type change) {
        change_value(x, change);
        tree[x].change = change;
        tree[x].isChange = true;
        tree[x].add = 0;
    }

    void push_down(size_t x) {
        if (tree[x].isChange) {
            change_tag(ls(x), tree[x].change);
            change_tag(rs(x), tree[x].change);
            tree[x].isChange = false;
            tree[x].change = 0;
        }
        if (tree[x].add) {
            add_tag(ls(x), tree[x].add);
            add_tag(rs(x), tree[x].add);
            tree[x].add = 0;
        }
    }

    void push_up(size_t x) {
        tree[x].value = merge_value(tree[ls(x)].value, tree[rs(x)].value);
    }

    void build(const std::vector<element_type> &arr, size_t x, size_t l,
               size_t r) {
        tree[x].id = x;
        tree[x].l = l, tree[x].r = r;
        if (l == r) {
            // how to assign value
            tree[x].value = assign_value(arr, l);
            return;
        }
        size_t m = (l + r) >> 1;
        build(arr, ls(x), l, m);
        build(arr, rs(x), m + 1, r);
        push_up(x);
    }

    // 区间加
    void _add(size_t l, size_t r, T val, size_t x = 1) {
        if (tree[x].inRange(l, r)) {
            add_tag(x, val);
            return;
        }
        push_down(x);
        if (!tree[ls(x)].outOfRange(l, r)) _add(l, r, val, ls(x));
        if (!tree[rs(x)].outOfRange(l, r)) _add(l, r, val, rs(x));
        push_up(x);
    }

    // 区间修改
    void _change(size_t l, size_t r, T val, size_t x = 1) {
        if (tree[x].inRange(l, r)) {
            change_tag(x, val);
            return;
        }
        push_down(x);
        if (!tree[ls(x)].outOfRange(l, r)) _change(l, r, val, ls(x));
        if (!tree[rs(x)].outOfRange(l, r)) _change(l, r, val, rs(x));
        push_up(x);
    }

    // 区间查询
    value_type _query(size_t l, size_t r, size_t x = 1) {
        if (tree[x].inRange(l, r)) {
            return tree[x].value;
        }
        push_down(x);
        if (tree[ls(x)].outOfRange(l, r)) return _query(l, r, rs(x));
        if (tree[rs(x)].outOfRange(l, r)) return _query(l, r, ls(x));
        return merge_value(_query(l, r, ls(x)), _query(l, r, rs(x)));
    }

public:
    // 区间加
    void add(size_t l, size_t r, element_type val) {
        assert(l <= r);
        _add(l, r, val, 1);
    }

    // 区间修改
    void change(size_t l, size_t r, element_type val) {
        assert(l <= r);
        _change(l, r, val, 1);
    }

    // 区间查询
    value_type query(size_t l, size_t r) {
        assert(l <= r);
        return _query(l, r, 1);
    }
};

class SegmentSumTree : public ISegmentTree<> {
private:
    value_type assign_value(const std::vector<element_type> &arr,
                            size_t x) override {
        return arr[x];
    }

    value_type merge_value(value_type x, value_type y) override {
        return x + y;
    }

    void add_value(size_t x, element_type val) override {
        tree[x].value += val * tree[x].size();
    }

    void change_value(size_t x, element_type val) override {
        tree[x].value = val * tree[x].size();
    }

public:
    explicit SegmentSumTree(const std::vector<element_type> &arr) {
        tree.resize(arr.size() * 4 + 1);
        build(arr, 1, 1, arr.size() - 1);
    }
};

class SegmentMaxTree : public ISegmentTree<> {
private:
    value_type assign_value(const std::vector<element_type> &arr,
                            size_t x) override {
        return arr[x];
    }

    value_type merge_value(value_type x, value_type y) override {
        return std::max(x, y);
    }

    void add_value(size_t x, element_type val) override { tree[x].value += val; }

    void change_value(size_t x, element_type val) override {
        tree[x].value = val;
    }

public:
    explicit SegmentMaxTree(const std::vector<element_type> &arr) {
        tree.resize(arr.size() * 4 + 1);
        build(arr, 1, 1, arr.size() - 1);
    }
};

class SegmentMinTree : public ISegmentTree<> {
private:
    value_type assign_value(const std::vector<element_type> &arr,
                            size_t x) override {
        return arr[x];
    }

    value_type merge_value(value_type x, value_type y) override {
        return std::min(x, y);
    }

    void add_value(size_t x, element_type val) override { tree[x].value += val; }

    void change_value(size_t x, element_type val) override {
        tree[x].value = val;
    }

public:
    explicit SegmentMinTree(const std::vector<element_type> &arr) {
        tree.resize(arr.size() * 4 + 1);
        build(arr, 1, 1, arr.size() - 1);
    }
};
```

### 可持久化线段树

- $dir[i]$ 保存的第 $i$ 个版本，初始版本为 $dir[0]$

**函数接口**

1. `value_type assign_value(const std::vector<element_type> &arr， size_t x)`：数组元素初始化为线段树的值

2. `value_type merge_value(value_type x, value_type y)`：定义值的合并操作

```cpp
namespace pst {

    using namespace std;
    constexpr int MAXN = 1e6 + 10;

    template<class T, class V>
    class IPersistentSegmentTree {
    protected:
        typedef T element_type;
        typedef V value_type;

        struct node {
            size_t ls, rs;
            value_type value;
        };

        size_t length;
        size_t total = 0;
        vector<node> tree;

        virtual value_type assign_value(const std::vector<element_type> &arr,
                                        size_t x) = 0;

        virtual value_type merge_value(value_type x, value_type y) = 0;

        void push_up(int node) {
            tree[node].value =
                    merge_value(tree[tree[node].ls].value, tree[tree[node].rs].value);
        }

        void build(const std::vector<element_type> &arr, size_t &node, size_t l,
                   size_t r) {
            node = ++total;
            if (l == r) {
                tree[node].value = assign_value(arr, l);
                return;
            }
            int mid = (l + r) >> 1;
            build(arr, tree[node].ls, l, mid);
            build(arr, tree[node].rs, mid + 1, r);
            push_up(node);
        }

        size_t _update(size_t &node, size_t last, size_t pos, element_type val,
                       size_t l, size_t r) {
            node = ++total;
            tree[node] = tree[last];
            if (l == r) {
                tree[node].value = val;
                return node;
            }
            int mid = (l + r) >> 1;
            if (pos <= mid)
                _update(tree[node].ls, tree[last].ls, pos, val, l, mid);
            else
                _update(tree[node].rs, tree[last].rs, pos, val, mid + 1, r);
            push_up(node);
            return node;
        }

        value_type _get(size_t node, size_t pos, size_t l, size_t r) {
            if (l == r) return tree[node].value;
            int mid = (l + r) >> 1;
            if (pos <= mid)
                return _get(tree[node].ls, pos, l, mid);
            else
                return _get(tree[node].rs, pos, mid + 1, r);
        }

    public:
        // 保存版本信息
        vector<size_t> dir;

        size_t update(size_t &node, size_t last, size_t pos, element_type val) {
            return _update(node, last, pos, val, 1, length);
        }

        value_type get(size_t node, size_t pos) {
            return _get(node, pos, 1, length);
        }
    };

    class PersistentSegmentTree
            : public IPersistentSegmentTree<long long, long long> {
    private:
        value_type assign_value(const std::vector<element_type> &arr, size_t x) {
            return arr[x];
        }

        value_type merge_value(value_type x, value_type y) { return x + y; }

    public:
        explicit PersistentSegmentTree(const std::vector<element_type> &arr) {
            length = arr.size() - 1;
            dir.resize(MAXN);
            tree.resize(MAXN << 5);
            build(arr, dir[0], 1, length);
        }
    };

    class KthMinTree : public IPersistentSegmentTree<int, int> {
    private:
        value_type assign_value(const std::vector<element_type> &arr, size_t x) {
            return arr[x];
        }

        value_type merge_value(value_type x, value_type y) { return x + y; }

        value_type _kthMin(size_t prev, size_t now, size_t l, size_t r, size_t k) {
            if (l == r) return l;
            int mid = (l + r) >> 1;
            int x = tree[tree[now].ls].value - tree[tree[prev].ls].value;
            if (k <= x)
                return _kthMin(tree[prev].ls, tree[now].ls, l, mid, k);
            else
                return _kthMin(tree[prev].rs, tree[now].rs, mid + 1, r, k - x);
        }

        value_type _lessOrEqual(size_t prev, size_t now, size_t l, size_t r, element_type k) {
            if (l == r) {
                return tree[now].value - tree[prev].value;
            }
            int mid = (l + r) >> 1;
            int ans = 0;
            if (k <= mid) {
                ans += _lessOrEqual(tree[prev].ls, tree[now].ls, l, mid, k);
            } else {
                ans += tree[tree[now].ls].value - tree[tree[prev].ls].value;
                ans += _lessOrEqual(tree[prev].rs, tree[now].rs, mid + 1, r, k);
            }
            return ans;
        }

    public:

        KthMinTree() {
            tree.resize(MAXN << 5);
            dir.resize(MAXN);
        }

        explicit KthMinTree(const std::vector<element_type> &arr) {
            length = arr.size() - 1;
            dir.resize(MAXN);
            tree.resize(MAXN << 5);
            unordered_map<element_type, value_type> cnt;
            for (int i = 1; i <= length; i++) {
                update(dir[i], dir[i - 1], arr[i], cnt[arr[i]] + 1);
                cnt[arr[i]] += 1;
            }
        }

        void resize(const std::vector<element_type> &arr) {
            total = 0;
            length = arr.size() - 1;
            unordered_map<element_type, int> cnt;
            for (int i = 1; i <= length; i++) {
                update(dir[i], dir[i - 1], arr[i], cnt[arr[i]] + 1);
                cnt[arr[i]] += 1;
            }
        }

        value_type kthMin(size_t l, size_t r, size_t k) {
            return _kthMin(dir[l - 1], dir[r], 1, length, k);
        }

        value_type lessOrEqual(size_t l, size_t r, element_type k) {
            return _lessOrEqual(dir[l - 1], dir[r], 1, length, k);
        }
    };
}  // namespace pst
```

### 可撤销并查集

```cpp
struct RollingDsu {
    std::vector<int> f, siz, tag, st;

    RollingDsu() = default;

    explicit RollingDsu(int n) : f(n + 1), siz(n + 1, 1), tag(n + 1, 0) { std::iota(f.begin(), f.end(), 0); }

    int find(int x) {
        while (x != f[x]) x = f[x];
        return x;
    }

    constexpr bool same(int x, int y) { return find(x) == find(y); }

    bool merge(int x, int y) {
        x = find(x);
        y = find(y);
        if (x == y) return false;
        if (siz[x] < siz[y]) {
            std::swap(x, y);
        }
        tag[y] -= tag[x];
        siz[x] += siz[y];
        f[y] = x;
        st.emplace_back(y);
        return true;
    }

    constexpr int size() {
        return st.size();
    }

    int size(int x) {
        return siz[find(x)];
    }

    void rollBack(int lastSize = 0) {
        assert(lastSize <= st.size());
        while (st.size() != lastSize) {
            int y = st.back();
            int x = f[y];
            siz[x] -= siz[y];
            tag[y] += tag[x];
            f[y] = y;
            st.pop_back();
        }
    }

    void add(int x, int v) { tag[find(x)] += v; }

};
```

### 时间线段树分治

```cpp
struct TimeSegTree {

    RollingDsu dsu;

    struct node {
        int l{0}, r{0};
        std::vector<std::pair<int, int> > op;
        bool exist{false};

        constexpr bool inRange(int l, int r) {
            return this->l >= l && this->r <= r;
        }

        constexpr bool outOfRange(int l, int r) {
            return this->l > r || this->r < l;
        }

        constexpr int length() { return this->r - this->l + 1; }

        constexpr int size() { return length(); }

        void add(int u, int v) { op.emplace_back(u, v); }

        void clear() { op.clear(); }
    };

    std::vector<node> tree;

    TimeSegTree() = default;

    // time:时间长度, size:图上节点个数
    explicit TimeSegTree(int time, int size) {
        dsu = RollingDsu(size);
        tree.resize(time * 4 + 5);
        build(time, 1, 1, time);
    }

    void build(int time, int u, int l, int r) {
        tree[u].l = l;
        tree[u].r = r;
        if (l == r) return;
        int mid = (l + r) >> 1;
        build(time, u << 1, l, mid);
        build(time, u << 1 | 1, mid + 1, r);
    }

    // 在[l, r]时间段上,连接x, y
    void modify(int l, int r, int x, int y, int u = 1) {
        if (x == y) return;
        assert(l <= r);
        if (tree[u].inRange(l, r)) {
            tree[u].add(x, y);
            return;
        }
        if (tree[u].outOfRange(l, r)) return;
        tree[u].exist = true;
        modify(l, r, x, y, u << 1);
        modify(l, r, x, y, u << 1 | 1);
    }

    void solve(int u = 1) {
        int lastSize = dsu.size();
        for (auto &[x, y]: tree[u].op) {
            dsu.merge(x, y);
        }
        if (!tree[u].exist) {
            // to do sth at this time
            execute(u);
            dsu.rollBack(lastSize);
            return;
        }
        solve(u << 1);
        solve(u << 1 | 1);
        dsu.rollBack(lastSize);
    }

    void execute(int u) {
        // how to do
    }
};
```

### 最近公共祖先(LCA)

```cpp
class LCA {
private:
    std::vector<std::vector<int> > f;
    std::vector<int> depth;

    void dfs(int root, int father, const std::vector<std::vector<int> > &g) {
        f[root][0] = father;
        depth[root] = depth[father] + 1;
        for (int i = 1; (1 << i) <= depth[root]; i++) {
            f[root][i] = f[f[root][i - 1]][i - 1];
        }
        for (auto const &v: g[root]) {
            if (v == father) {
                continue;
            }
            dfs(v, root, g);
        }
    }

public:

    // g: 无向边构成的树, root: 根节点, 默认为1
    explicit LCA(int n, const std::vector<std::vector<int>> &g, int root = 1) {
        f.resize(n + 1, std::vector<int>(32));
        depth.resize(n + 1);
        dfs(root, 0, g);
    }

    // 返回u和v的最近公共祖先
    int query(int u, int v) {
        if (depth[u] < depth[v]) {
            std::swap(u, v);
        }
        while (depth[u] > depth[v]) {
            u = f[u][std::__lg(depth[u] - depth[v])];
        }
        if (u == v) {
            return u;
        }
        for (int i = std::__lg(depth[u]); i >= 0; i--) {
            if (f[u][i] != f[v][i]) {
                u = f[u][i];
                v = f[v][i];
            }
        }
        return f[u][0];
    }

    // 返回u和v之间的距离
    int distance(int u, int v) {
        return depth[u] + depth[v] - 2 * depth[query(u, v)];
    }

};
```

## 图结构

### 2-SAT

```cpp
struct TwoSat {
    int n;
    std::vector<std::vector<int>> e;
    std::vector<bool> ans;
    TwoSat(int n) : n(n), e(2 * n), ans(n) {}
    void addClause(int u, bool f, int v, bool g) {
        e[2 * u + !f].push_back(2 * v + g);
        e[2 * v + !g].push_back(2 * u + f);
    }
    bool satisfiable() {
        std::vector<int> id(2 * n, -1), dfn(2 * n, -1), low(2 * n, -1);
        std::vector<int> stk;
        int now = 0, cnt = 0;
        std::function<void(int)> tarjan = [&](int u) {
            stk.push_back(u);
            dfn[u] = low[u] = now++;
            for (auto v : e[u]) {
                if (dfn[v] == -1) {
                    tarjan(v);
                    low[u] = std::min(low[u], low[v]);
                } else if (id[v] == -1) {
                    low[u] = std::min(low[u], dfn[v]);
                }
            }
            if (dfn[u] == low[u]) {
                int v;
                do {
                    v = stk.back();
                    stk.pop_back();
                    id[v] = cnt;
                } while (v != u);
                ++cnt;
            }
        };
        for (int i = 0; i < 2 * n; ++i) if (dfn[i] == -1) tarjan(i);
        for (int i = 0; i < n; ++i) {
            if (id[2 * i] == id[2 * i + 1]) return false;
            ans[i] = id[2 * i] > id[2 * i + 1];
        }
        return true;
    }
    std::vector<bool> answer() { return ans; }
};
```

### Tarjan求强连通分量

```cpp
const int maxn = 1e5 + 5;
stack<int> stk;
// instk:是否在栈中  scc:每个点所属的强连通分量编号  cscc:强连通分量的数量 sz:强连通分量的大小
int dfsn[maxn], low[maxn], instk[maxn], scc[maxn], dfsncnt = 0, cscc = 0, sz[maxn];
vector<vector<int>> e(maxn);
void tarjan(int p) {
    low[p] = dfsn[p] = ++dfsncnt;
    instk[p] = 1;
    stk.push(p);
    for (auto q: e[p]) {
        if (!dfsn[q]) {
            tarjan(q);
            low[p] = min(low[p], low[q]);
        } else if (instk[q]) {
            low[p] = min(low[p], dfsn[q]);
        }
    }
    if (low[p] == dfsn[p]) {
        int top;
        cscc++;
        do {
            top = stk.top();
            stk.pop();
            instk[top] = 0;
            scc[top] = cscc;
            sz[cscc]++;
        } while (top != p);
    }
}

for (int i = 1; i <= n; i++) {
    if (!dfsn[i]) {
        tarjan(i);
    }
}
```

### Tarjan求割点

```cpp
const int N = 1e5 + 5;
vector<int> edge[N];
int dfn[N], root[N];
int ct;
vector<int> cut_points;

void tarjan(int u, bool isroot)
{
    int tot = 0;
    root[u] = dfn[u] = ++ct;
    for (auto v : edge[u])
    {
        if (!dfn[v])
        {
            tarjan(v, 0);
            root[u] = min(root[u], root[v]);
            tot += root[v] >= dfn[u];
        }
        else
            root[u] = min(root[u], dfn[v]);
    }
    if ((isroot && tot >= 2) || (!isroot && tot >= 1))
        cut_points.emplace_back(u);
}

tarjan(1, 1);
```

### Tarjan求割边

```cpp
const int N = 1e5 + 5;
vector<int> edge[N];
int dfn[N], root[N], fa[N], ct;
struct node
{
    int u, v;
};
vector<node> cut_edge;
void tarjan(int u)
{
    int tot = 0;
    root[u] = dfn[u] = ++ct;
    for (auto v : edge[u])
    {
        if (!dfn[v])
        {
            fa[v] = u;
            tarjan(v);
            root[u] = min(root[u], root[v]);
            if (root[v] > dfn[u])
                cut_edge.emplace_back(node{u, v});
        }
        else if (v != fa[u])
            root[u] = min(root[u], dfn[v]);
    }
}
tarjan(1);
```

### 费用流

```cpp
#include<bits/stdc++.h>
using namespace std;
using i64 = long long;
struct MCFGraph {
    struct Edge {
        int v, c, f;
        Edge(int v, int c, int f) : v(v), c(c), f(f) {}
    };
    const int n;
    vector<Edge> e;
    vector<vector<int>> g;
    vector<i64> h, dis;
    vector<int> pre;
    bool dijkstra(int s, int t) {
        dis.assign(n, numeric_limits<i64>::max());
        pre.assign(n, -1);
        priority_queue<pair<i64, int>, vector<pair<i64, int>>, greater<pair<i64, int>>> que;
        dis[s] = 0;
        que.emplace(0, s);
        while (!que.empty()) {
            i64 d = que.top().first;
            int u = que.top().second;
            que.pop();
            if (dis[u] < d) continue;
            for (int i : g[u]) {
                int v = e[i].v;
                int c = e[i].c;
                int f = e[i].f;
                if (c > 0 && dis[v] > d + h[u] - h[v] + f) {
                    dis[v] = d + h[u] - h[v] + f;
                    pre[v] = i;
                    que.emplace(dis[v], v);
                }
            }
        }
        return dis[t] != numeric_limits<i64>::max();
    }
    MCFGraph(int n) : n(n), g(n) {}
    void addEdge(int u, int v, int c, int f) {//c是流量,f是费用.
        if (f < 0) {
            g[u].push_back(e.size());
            e.emplace_back(v, 0, f);
            g[v].push_back(e.size());
            e.emplace_back(u, c, -f);
        } else {
            g[u].push_back(e.size());
            e.emplace_back(v, c, f);
            g[v].push_back(e.size());
            e.emplace_back(u, 0, -f);
        }
    }
    pair<int, i64> flow(int s, int t) {
        int flow = 0;
        i64 cost = 0;
        h.assign(n, 0);
        while (dijkstra(s, t)) {
            for (int i = 0; i < n; ++i) h[i] += dis[i];//更新势能
            int aug = numeric_limits<int>::max();//流量
            for (int i = t; i != s; i = e[pre[i] ^ 1].v) aug = min(aug, e[pre[i]].c);
            for (int i = t; i != s; i = e[pre[i] ^ 1].v) {
                e[pre[i]].c -= aug;
                e[pre[i] ^ 1].c += aug;
            }
            flow += aug;
            cost += i64(aug) * h[t];
        }
        return make_pair(flow, cost);
    }
};
```

## 杂项

### MODINT

```cpp
#if __cplusplus < 201703L
#define constexpr inline
#endif

template<long long T = 998244353>
struct ModInt {
    long long x;

    constexpr ModInt(const long long x = 0) : x(x % T) {
    }

    [[nodiscard]] constexpr long long val() const { return x; }

    constexpr ModInt &operator=(const ModInt &a) {
        x = a.x;
        return *this;
    }

    constexpr ModInt &operator=(const long long y) {
        x = y % T;
        return *this;
    }

    constexpr ModInt operator+(const ModInt &a) const {
        int x0 = x + a.x;
        return ModInt(x0 < T ? x0 : x0 - T);
    }

    constexpr ModInt operator-(const ModInt &a) const {
        int x0 = x - a.x;
        return ModInt(x0 < 0 ? x0 + T : x0);
    }

    constexpr ModInt operator*(const ModInt &a) const {
        return ModInt(1LL * x * a.x % T);
    }

    constexpr ModInt operator/(const ModInt &a) const {
        return *this * a.inv();
    }

    constexpr bool operator==(const ModInt &a) const { return x == a.x; };

    constexpr bool operator!=(const ModInt &a) const { return x != a.x; };

    constexpr void operator+=(const ModInt &a) {
        x += a.x;
        if (x >= T) x -= T;
    }

    constexpr void operator-=(const ModInt &a) {
        x -= a.x;
        if (x < 0) x += T;
    }

    constexpr void operator*=(const ModInt &a) { x = 1LL * x * a.x % T; }

    constexpr void operator/=(const ModInt &a) { *this = *this / a; }

    constexpr friend ModInt operator+(int y, const ModInt &a) {
        int x0 = y + a.x;
        return ModInt(x0 < T ? x0 : x0 - T);
    }

    constexpr friend ModInt operator-(int y, const ModInt &a) {
        int x0 = y - a.x;
        return ModInt(x0 < 0 ? x0 + T : x0);
    }

    constexpr friend ModInt operator*(int y, const ModInt &a) {
        return ModInt(1LL * y * a.x % T);
    }

    constexpr friend ModInt operator/(int y, const ModInt &a) {
        return ModInt(y) / a;
    }

    constexpr friend std::ostream &operator<<(std::ostream &os, const ModInt &a) {
        return os << a.x;
    }

    constexpr friend std::istream &operator>>(std::istream &is, ModInt &t) {
        return is >> t.x;
    }

    constexpr ModInt pow(int n) const {
        ModInt res(1), mul(x);
        while (n) {
            if (n & 1) res *= mul;
            mul *= mul;
            n >>= 1;
        }
        return res;
    }

    constexpr ModInt operator^(const int n) const { return pow(n); }

    constexpr ModInt inv() const {
        int a = x, b = T, u = 1, v = 0;
        while (b) {
            int t = a / b;
            a -= t * b;
            std::swap(a, b);
            u -= t * v;
            std::swap(u, v);
        }
        if (u < 0) u += T;
        return u;
    }

    constexpr ModInt operator~() const { return inv(); }
};
```

### Random

```cpp
std::mt19937 sd(std::random_device{}());
std::uniform_int_distribution<unsigned> rd1(min,max);
std::uniform_real_distribution<double> rd2(min,max); //均匀分布
std::normal_distribution<double> rd3(min,max); //正态分布
```

### pbds

```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/hash_policy.hpp>
#include <ext/pb_ds/priority_queue.hpp>
#include <ext/pb_ds/tree_policy.hpp>
#include <ext/pb_ds/trie_policy.hpp>
#include <ext/rope>
using namespace __gnu_pbds;
using namespace __gnu_cxx;
template <typename T, class P = std::less<T>>
using ordered_set =
    tree<T, null_type, P, rb_tree_tag, tree_order_statistics_node_update>;
/*
定义一颗红黑树
int 关键字类型
null_type无映射(低版本g++为null_mapped_type)
less<int>从小到大排序
rb_tree_tag 红黑树（splay_tree_tag）
tree_order_statistics_node_update结点更新
插入t.insert();
删除t.erase();
求k在树中是第几大:t.order_of_key();
求树中的第k大:t.find_by_order();
前驱:t.lower_bound();
后继t.upper_bound();
a.join(b)b并入a 前提是两棵树的key的取值范围不相交
a.split(v,b)key小于等于v的元素属于a，其余的属于b
T.lower_bound(x)   >=x的min的迭代器
T.upper_bound((x)  >x的min的迭代器
T.find_by_order(k) 第k个数比它小的数
*/

template <typename T, class P = std::less<T>>
using heap = __gnu_pbds::priority_queue<T, P, pairing_heap_tag>;
/*
push()  //会返回一个迭代器
top()  //同 stl
size()  //同 stl
empty() //同 stl
clear()  //同 stl
pop()  //同 stl
join(priority_queue &other)  //合并两个堆,other会被清空
split(Pred prd,priority_queue &other)  //分离出两个堆
modify(point_iterator it,const key)  //修改一个节点的值
erase(point_iterator it) //删除一个节点
*/

template <typename T, typename P = std::less<T>>
using cmap = cc_hash_table<T, P>; // 拉链法(内存小)
template <typename T, typename P = std::less<T>>
using gmap = gp_hash_table<T, P>; // 查探法(速度快)

using trie =
    __gnu_pbds::trie<std::string, null_type, trie_string_access_traits<>,
                     pat_trie_tag, trie_prefix_search_node_update>;

/*
tr.insert(string s); //插入s
tr.erase(string s); //删除s
tr.join(trie b); //将b并入tr
pair//pair的使用如下：
pair<tr::iterator,tr::iterator> range=base.prefix_range(string x);
for(tr::iterator it=range.first;it!=range.second;it++)
        cout<<*it<<' '<<endl;
//pair中第一个是起始迭代器，第二个是终止迭代器，遍历过去就可以找到所有字符串了。
*/

rope<int> *r[100000];

/*
push_back(type x): 在末尾插入x
insert(int pos, type *s,int n):
将字符串s的前n位插入rope的下标pos处，如没有参数n则将字符串s的所有位都插入rope的下标pos处
append(type *s,int pos,int n):
把字符串s中从下标pos开始的n个字符连接到rope的结尾，如没有参数n则把字符串s中下标pos后的所有字符连接到rope的结尾，如没有参数pos则把整个字符串s连接到rope的结尾
erase(int pos, int x): 在pos处删除x个元素
length(): 返回数组长度
size(): 返回数组长度
replace(pos, type *s):
从rope的下标pos开始替换成字符串x，x的长度为从pos开始替换的位数，如果pos后的位数不够就补足
substr(int pos, int len): 从pos处开始提取len个元素
copy(int pos, int x, type *s):
从rope的下标pos开始的len个字符用s代替，如果pos后的位数不够就补足
at(int x):
访问第x个元素，同rp[x]
拷贝历史版本: r[i] = new rope(*r[i - 1]);
*/
```
