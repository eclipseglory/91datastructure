// import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       props: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })

import BPlusTree from '@/js/bptree.js';
import Bucket from '@/js/bucket.js';


describe('B+ Tree model test', () => {
  it('Leaf test', () => {
    let bucket = new Bucket(100);
    let randoms = [];
    for (let i = 0; i < 90; i++) {
      let r = Math.floor(Math.random() * 100);
      if (randoms.indexOf(r) == -1) randoms.push(r);
    }
    randoms.forEach((id) => {
      let result = bucket.insert({ id: id });
      console.assert(result.code == 0);
    });

    console.assert(bucket.nodesCount == randoms.length);

    for (let i = 0; i < 10; i++) {
      let index = Math.floor(Math.random() * randoms.length);
      let e = randoms[index];
      let result = bucket.insert({ id: e });
      console.assert(result.code == 1);
    }

  });
  it('insert/update', () => {

    let tree = new BPlusTree(4);
    let inserting = []
    for (let i = 0; i < 20; i++) {
      // let num = Math.floor(Math.random() * 100);
      let num = i;
      inserting.push(num);
      tree.insert(num);
    }

    console.assert(tree.insert(6).code == 1);
    console.assert(tree.insert(20).code == 0);
    let leftLeaf = getLeftLeaf(tree.root);
    let inserted = [];
    getAllInserted(leftLeaf, inserted);

    inserting.sort((a, b) => a - b);

    for (let i = 0; i < inserting.length; i++) {
      console.assert(inserting[i] == inserted[i], 'error');
    }

    function getLeftLeaf(root) {
      let left;
      if (root instanceof Bucket) {
        left = root;
      } else {
        left = root.firstPointer;
      }
      while (!(left instanceof Bucket)) {
        left = left.firstPointer;
      }
      return left;
    }

    function getAllInserted(bucket, inserted) {
      if (bucket == null) return;
      bucket.internelNodes.forEach((n) => {
        inserted.push(n.id);
      })
      getAllInserted(bucket.next, inserted);
    }
  })
});

/**
 * 验证b+树的正确性。
 * 1. 叶子节点的next能正确连接，即所有数据必须是有序的，且无重复，这里记录一下之前添加的数据，需要进行对比
 * 2. 根节点往下查，每个Index Bucket拥有的索引ID数量肯定比Pointer的数量少1，索引值必须从小到大排列
 * 3. 每个IndexBucket的Pointer对应的节点，如果是IndexBucket，该索引节点的所有索引数据必须小于父节点Piointer对应index的索引值，
 * 且值必须大于Pointer对应Index+1的索引值
 * @param {none} tree 
 */
function validateBPTree(tree) {

}