#include<bits/stdc++.h>
using namespace std;

int main() {

    long long n;
    cin>>n;
    vector<long long>arr(n);
    for(long long i=0;i<n;i++){
        cin>>arr[i];
    }

    long long current = arr[0];
    long long best = arr[0];

    for(long long i = 1; i < arr.size(); i++) {

        current = max(arr[i], current + arr[i]);

        best = max(best, current);
    }

    cout << best;
}
