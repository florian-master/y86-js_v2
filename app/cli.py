from base64 import b64encode
import argparse
import urllib.request

parser = argparse.ArgumentParser(description='Help making request to y86 simulator')

parser.add_argument('-H', '--host', help='Set the simulator host.')
parser.add_argument('-r', '--route', help='Set the request route.')
parser.add_argument('-ys', help='Path to the file containing the program to use.', required=True)
parser.add_argument('-k', '--kernel', help='Set the kernel to use.')
parser.add_argument('-hcl', help='Path to the file containing HCL code to use.')
parser.add_argument('-is', '--instructionSet', help='Path to the file containing the instruction set to use.')
parser.add_argument('-s', '--start', help='Set where the program should start. It can be a line or a label.')
parser.add_argument('-bp', '--breakpoints', help='A string containing the breakpoints, separated by a comma. A breakpoint can be a line number or a label name.')
parser.add_argument('-v', '--verbose', help='Verbose mode. Show the request which will be executed', action='store_true')

args = parser.parse_args()


def stringToBase64(str) :
    return b64encode(str.encode('ascii')).decode('ascii')

def argFromFile(path) :
    f = open(path, 'r')
    return stringToBase64(f.read())


host = 'http://localhost:8080'
route = '/cli'
ysReq = 'ys='
kernelReq = 'kernelName='
hclReq = 'hcl='
instructionSetReq = 'instructionSet='
startReq = 'start='
breakpointsReq = 'breakpoints='

req = ''

if args.host :
    host = args.host

if args.route :
    route = args.route

if args.ys :
    ysReq += argFromFile(args.ys)

req = host + route + '?' + ysReq

if args.kernel :
    kernelReq += args.kernel
    req += '&' + kernelReq

if args.hcl:
    hclReq += argFromFile(args.hcl)
    req += '&' + hclReq

if args.instructionSet :
    instructionSetReq += argFromFile(args.instructionSet)
    req += '&' + instructionSetReq

if args.start :
    startReq += args.start
    req += '&' + startReq

if args.breakpoints :
    breakpointsReq += args.breakpoints
    req += '&' + breakpointsReq

if args.verbose :
    print('Going to execute : ', req)
    print('================================')

response = urllib.request.urlopen(req)

if response.status == 200 :
    print('Status : Succeed')
elif response.status == 202 :
    print('Status : Error(s) happened')
elif response.status == 500 :
    print('Status : Server has encounter an unexpected error')
else :
    print('Status : Unexpected status code :', response.status)

print(response.read().decode('ascii'))
