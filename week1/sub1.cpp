#include<bits/stdc++.h>
using namespace std;

int main() {

    long long n, x;
    cin >> n >> x;

    vector<long long> arr(n);

    for(long long i = 0; i < n; i++) {
        cin >> arr[i];
    }

    long long left = 0;
    long long sum = 0;
    long long count = 0;

    for(long long right = 0; right < n; right++) {

        sum += arr[right];

        while(sum > x) {
            sum -= arr[left];
            left++;
        }

        if(sum == x) {
            count++;
        }
    }

    cout << count;
}
