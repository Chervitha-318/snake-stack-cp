#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    cin>>n;
    vector<long long>arr(n);
    for(int i=0;i<n;i++){
        cin>>arr[i];
    }
    sort(arr.begin(),arr.end());
    long long num=1;
    for(int i=1;i<n;i++){
        if(arr[i]!=arr[i-1])num=num+1;
    }
    cout<<num;
}

