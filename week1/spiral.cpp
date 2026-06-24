#include<bits/stdc++.h>
using namespace std;
int main(){
        long long t;cin>>t;
        long long arr[t][2];
        for(int i=0;i<t;i++){
         for(int j=0;j<2;j++){
                 cin>>arr[i][j];
         }
        }
        for(int i=0;i<t;i++){
        long long n=max(arr[i][0],arr[i][1]);
         if(n==arr[i][0]){
                 if(n%2==0){
                         cout<<(n*n)-(arr[i][1])+1<<" ";
                 }
                 else{
                         cout<<((n-1)*(n-1))+(arr[i][1])<<" ";
                 }
         }
         else{
                  if(n%2==0){
                         cout<<((n-1)*(n-1))+(arr[i][0])<<" ";
                 }
                 else{
                         cout<<(n*n)-(arr[i][0])+1<<" ";
                 }
         }
        }



        }
       
