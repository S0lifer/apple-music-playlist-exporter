const assert = require('chai').assert
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { stdout } = require('process')

describe('apple music playlist export tests', function () {
  it('app has been supplied with nothing', function (done) {
    exec('node playlist.js', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      expect(stdout).to.include('please supply valid xml file')
      done()
    })
  })

  it('app should check for xml file', function (done) {
    exec('node playlist.js reciept.pdf', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      expect(stdout).to.include('not an xml file')
      done()
    })
  })

  it('app should check if supplied file exists', function (done) {
    exec('node playlist.js augment.xml', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      expect(stdout).to.include('file not found')
      done()
    })
  })

  it('app should check if supplied file is an apple music playlist', function (done) {
    exec('node playlist.js test/example.xml', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      expect(stdout).to.include('not an apple music playlist')
      done()
    })
  })

  it('app should check if a folder was created with the playlist name', function (done) {
    exec('node playlist.js test/AKDPlaylistNonDuplicate.xml', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      fs.rm('./AKDPlaylistNonDuplicate',
        { recursive: true, force: true }, (err) => {
          if (err) {
            return console.log('error occurred in deleting directory', err)
          }
        })
      done()
    })
  })

  it('app should check if a folder was created with the duplicate playlist name', function (done) {
    exec('node playlist.js test/AKDPlaylistDuplicate.xml', (error, stdout, stderr) => {
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      fs.rm('./AKDPlaylistDuplicate',
        { recursive: true, force: true }, (err) => {
          if (err) {
            return console.log('error occurred in deleting directory', err)
          }
        })
      done()
    })
  })
})